

// * UTILITY FUNCTIONS




// const orderFulfillmentHelper = async (orderPaymentId, req) => {
//   const order = await EcomOrder.findOneAndUpdate(
//     {
//       paymentId: orderPaymentId,
//     },
//     {
//       $set: {
//         isPaymentDone: true,
//       },
//     },
//     { new: true }
//   );

//   if (!order) {
//     throw new ApiError(404, "Order does not exist");
//   }

//   // Get the user's card
//   const cart = await Cart.findOne({
//     owner: req.user._id,
//   });

//   const userCart = await getCart(req.user._id);

//   // Logic to handle product's stock change once order is placed
//   let bulkStockUpdates = userCart.items.map((item) => {
//     // Reduce the products stock
//     return {
//       updateOne: {
//         filter: { _id: item.product?._id },
//         update: { $inc: { stock: -item.quantity } }, // subtract the item quantity
//       },
//     };
//   });

//   // * (bulkWrite()) is faster than sending multiple independent operations (e.g. if you use create())
//   // * because with bulkWrite() there is only one network round trip to the MongoDB server.
//   await Product.bulkWrite(bulkStockUpdates, {
//     skipValidation: true,
//   });

//   await sendEmail({
//     email: req.user?.email,
//     subject: "Order confirmed",
//     mailgenContent: orderConfirmationMailgenContent(
//       req.user?.username,
//       userCart.items,
//       order.discountedOrderPrice ?? 0 // send discounted price in the mail which is paid by the user
//     ),
//   });

//   cart.items = []; // empty the cart
//   cart.coupon = null; // remove the associated coupon

//   await cart.save({ validateBeforeSave: false });
//   return order;
// };


let razorpayInstance;

try {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} catch (error) {
  console.error("RAZORPAY ERROR: ", error);
}


const generateRazorpayOrder = asyncHandler(async (req, res) => {
  const { addressId } = req.body;

  if (!razorpayInstance) {
    console.error("RAZORPAY ERROR: `key_id` is mandatory");
    throw new ApiError(500, "Internal server error");
  }

  // Check if address is valid and is of logged in user's
  const address = await Address.findOne({
    _id: addressId,
    owner: req.user._id,
  });

  if (!address) {
    throw new ApiError(404, "Address does not exists");
  }

  const cart = await Cart.findOne({
    owner: req.user._id,
  });

  if (!cart || !cart.items?.length) {
    throw new ApiError(400, "User cart is empty");
  }
  const orderItems = cart.items;
  const userCart = await getCart(req.user._id);

  // note down th total cart value and cart value after the discount
  // If no coupon is applied the total and discounted prices will be the same
  const totalPrice = userCart.cartTotal;
  const totalDiscountedPrice = userCart.discountedTotal;

  const orderOptions = {
    amount: parseInt(totalDiscountedPrice) * 100, // in paisa
    currency: "INR", // Might accept from client
    receipt: nanoid(10),
  };

  razorpayInstance.orders.create(
    orderOptions,
    async function (err, razorpayOrder) {
      if (!razorpayOrder || (err && err.error)) {
        // Throwing ApiError here will not trigger the error handler middleware
        return res
          .status(err.statusCode)
          .json(
            new ApiResponse(
              err.statusCode,
              null,
              err.error.reason ||
                "Something went wrong while initialising the razorpay order."
            )
          );
      }

      const { addressLine1, addressLine2, city, country, pincode, state } =
        address;

      // Create an order while we generate razorpay session
      // In case payment is done and there is some network issue in the payment verification api
      // We will at least have a record of the order
      const unpaidOrder = await EcomOrder.create({
        address: {
          addressLine1,
          addressLine2,
          city,
          country,
          pincode,
          state,
        },
        customer: req.user._id,
        items: orderItems,
        orderPrice: totalPrice ?? 0,
        discountedOrderPrice: totalDiscountedPrice ?? 0,
        paymentProvider: PaymentProviderEnum.RAZORPAY,
        paymentId: razorpayOrder.id,
        coupon: userCart.coupon?._id,
      });
      if (unpaidOrder) {
        // if order is created then only proceed with the payment
        return res
          .status(200)
          .json(
            new ApiResponse(200, razorpayOrder, "Razorpay order generated")
          );
      } else {
        return res
          .status(500)
          .json(
            new ApiResponse(
              500,
              null,
              "Something went wrong while initialising the razorpay order."
            )
          );
      }
    }
  );
});

const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  let expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    const order = await orderFulfillmentHelper(razorpay_order_id, req);
    return res
      .status(201)
      .json(new ApiResponse(201, order, "Order placed successfully"));
  } else {
    throw new ApiError(400, "Invalid razorpay signature");
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  let order = await EcomOrder.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order does not exist");
  }

  if (order.status === OrderStatusEnum.DELIVERED) {
    throw new ApiError(400, "Order is already delivered");
  }

  order = await EcomOrder.findByIdAndUpdate(
    orderId,
    {
      $set: {
        status,
      },
    },
    { new: true }
  );
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        status,
      },
      "Order status changed successfully"
    )
  );
});

const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await EcomOrder.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(orderId),
      },
    },
    // lookup for a customer associated with the order
    {
      $lookup: {
        from: "users",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              email: 1,
            },
          },
        ],
      },
    },
    // lookup for a coupon applied while placing the order
    {
      $lookup: {
        from: "coupons",
        foreignField: "_id",
        localField: "coupon",
        as: "coupon",
        pipeline: [
          {
            $project: {
              name: 1,
              couponCode: 1,
            },
          },
        ],
      },
    },
    // lookup returns array so get the first element of address and customer
    {
      $addFields: {
        customer: { $first: "$customer" },
        coupon: { $ifNull: [{ $first: "$coupon" }, null] },
      },
    },
    // Now we have array of order items with productId being the id of the product that is being ordered
    // So we want to send complete details of that product

    // To do so we first unwind the items array
    { $unwind: "$items" },

    // it gives us documents with `items` being an object with ket {_id, productId, quantity}
    {
      // lookup for a product associated
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "items.product", // store that looked up product in items.product key
      },
    },
    // As we know lookup will return an array
    // we want product key to be an object not array
    // So, once lookup is done we access first item in an array
    { $addFields: { "items.product": { $first: "$items.product" } } },
    // As we have unwind the items array the output of the following stages is not desired one
    // So to make it desired we need to group whatever we have unwinded
    {
      $group: {
        // we group the documents with `_id (which is an order id)`
        // The reason being, each order is unique and main entity of this api
        _id: "$_id",
        order: { $first: "$$ROOT" }, // we also assign whole root object to be the order
        // we create a new key orderItems in which we will push each order item (product details and quantity) with complete product details
        orderItems: {
          $push: {
            _id: "$items._id",
            quantity: "$items.quantity",
            product: "$items.product",
          },
        },
      },
    },
    {
      $addFields: {
        // now we will create a new items key in the order object and assign the orderItems value to it to keep everything in the `order` key
        "order.items": "$orderItems",
      },
    },
    {
      $project: {
        // ignore the orderItems key as we don't need it
        orderItems: 0,
      },
    },
  ]);

  if (!order[0]) {
    throw new ApiError(404, "Order does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order[0], "Order fetched successfully"));
});

const getOrderListAdmin = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const orderAggregate = EcomOrder.aggregate([
    {
      $match:
        status && AvailableOrderStatuses.includes(status.toUpperCase())
          ? {
              status: status.toUpperCase(),
            }
          : {},
    },
    // lookup for a customer associated with the order
    {
      $lookup: {
        from: "users",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "coupons",
        foreignField: "_id",
        localField: "coupon",
        as: "coupon",
        pipeline: [
          {
            $project: {
              name: 1,
              couponCode: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        customer: { $first: "$customer" },
        coupon: { $ifNull: [{ $first: "$coupon" }, null] },
        totalOrderItems: { $size: "$items" },
      },
    },
    {
      $project: {
        items: 0,
      },
    },
  ]);

  const orders = await EcomOrder.aggregatePaginate(
    orderAggregate,
    getMongoosePaginationOptions({
      page,
      limit,
      customLabels: {
        totalDocs: "totalOrders",
        docs: "orders",
      },
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

export {
  generateRazorpayOrder,
  generatePaypalOrder,
  verifyRazorpayPayment,
  verifyPaypalPayment,
  getOrderById,
  getOrderListAdmin,
  updateOrderStatus,
};
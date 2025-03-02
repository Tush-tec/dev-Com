import Razorpay from 'razorpay';
import { nanoid } from 'nanoid'
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import crypto from "crypto"
import { Order } from '../models/order.model.js';
import { Address } from '../models/address.model.js';
import { Cart } from '../models/cart.model.js';
import { error } from 'console';
import { Product } from '../models/product.model.js';

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// console.log(process.env.RAZORPAY_KEY_ID);


const orderFulfillmentHelper = async (orderPaymentId, req) => {

  const order = await Order.findOneAndUpdate(
    {
      razorpayPaymentId: orderPaymentId 
    },
    { 
      $set:{ status: "Paid" } 
    },
    { new: true }
  );

  if (!order) {
    throw new ApiError(404, "Order does not exist");
  }


  const cartAggregation = await Cart.aggregate([
    { $match: { _id: { $in: order.cartItems } } },  
    {
      $lookup: {
        from: "products", 
        localField: "items.productId", 
        foreignField: "_id", 
        as: "cartItemsDetails", 
      },
    },
  ]);

  const cart = cartAggregation[0]; // Extract the cart object

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // Prepare bulk updates for reducing stock
  const bulkStockUpdates = cart.items.map((item) => ({
    updateOne: {
      filter: { _id: item.productId }, // Find product by ID
      update: { $inc: { stock: -item.quantity } }, // Reduce stock
    },
  }));

  await Product.bulkWrite(bulkStockUpdates, { skipValidation: true });

  // Clear cart after purchase
  await Cart.updateOne({ _id: cart._id }, { $set: { items: [] } });

  return order;
};


const generateRazorpayOrder = asyncHandler(async (req, res) => {
  const { addressId, paymentMethod } = req.body;
  console.log(addressId);
  console.log(paymentMethod);

  if (!razorpayInstance) {
    throw new ApiError(500, "Razorpay instance not initialized");
  }

  // Fetch the address
  const address = await Address.findOne({ _id: addressId, owner: req.user._id });

  if (!address) throw new ApiError(404, "Address not found");

  // Fetch cart and join cartItems with product details using aggregation
  const cartAggregation = await Cart.aggregate([
    { $match: { owner: req.user._id } },
    {
      $lookup: {
        from: "products", // Name of the referenced collection
        localField: "items.productId", // Field in Cart collection
        foreignField: "_id", // Corresponding field in Product collection
        as: "cartItemsDetails",
      },
    },
  ]);

  const cart = cartAggregation[0]; 
  // console.log("cart", cartAggregation[0]);
  // console.log("Cart items Details", cart.cartItemsDetails);
  
  

  if (!cart || !cart.items.length) throw new ApiError(400, "User cart is empty");
//   console.log("cartItems", cart.items);
// console.log("cartItems with quantity", cart.items[0].quantity);
// console.log("cartItems with productDetails", cart);

  // Calculate total amount
  const totalAmount = cart.items.reduce((sum, item) => {
    
    const product = cart.cartItemsDetails.find(p => p._id.toString() === item.productId.toString());

    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  console.log(totalAmount * 100);

  const validPaymentMethods = {
    Online: "Razorpay", // Convert "Online" to "Razorpay"
    UPI: "UPI",
    Razorpay: "Razorpay",
  };

  const formattedPaymentMethod = validPaymentMethods[paymentMethod];

  if (!formattedPaymentMethod) {
    throw new ApiError(400, "Invalid payment method");
  }
  

  // Create Razorpay order options
  const orderOptions = {
    amount: totalAmount * 100, 
    currency: "INR",
    receipt: nanoid(10),
  };

  // Create Razorpay order
  razorpayInstance.orders.create(orderOptions, async (err, razorpayOrder) => {
    
    if (err || !razorpayOrder) {
      console.log(err.error.description);
      
      return res.status(500).json(new ApiResponse(500, err.error.description, `${err.error.description}`));
    }

    // Create order in database
    const newOrder = await Order.create({
      owner: req.user._id,
      cartItems: cart._id, // Ensure this contains item references
      address: address._id,
      paymentMethod :formattedPaymentMethod,
      razorpayPaymentId: razorpayOrder.id,
      totalAmount, 
      status: "Pending",
    });

    if (!newOrder) {
      throw new ApiError(500, "Order not created!");
    }

    return res.status(200).json(new ApiResponse(200, newOrder, "Razorpay order created"));
  });
});


const verifyRazorpayPayment = asyncHandler(async (req, res) => {

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  let expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {

    const order = await orderFulfillmentHelper(razorpay_order_id, req);
    return res.status(201).json(new ApiResponse(201, order, "Order placed successfully"));
  }
  throw new ApiError(400, "Invalid Razorpay signature");
});

const updateOrderStatus = asyncHandler(async (req, res) => {

  const { orderId } = req.params;
  const { status } = req.body;

  let order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order does not exist");

  if (order.status === "Delivered") {
    throw new ApiError(400, "Order is already delivered");
  }

  order.status = status;
  await order.save();
  return res.status(200).json(new ApiResponse(200, { status }, "Order status updated"));
});

const getOrderById = asyncHandler(async (req, res) => {

  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate("owner cartItems address");

  if (!order) throw new ApiError(404, "Order does not exist");

  return res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));

});

const getOrderListAdmin = asyncHandler(async (req, res) => {

  const { status, page = 1, limit = 10 } = req.query;
  const query = status ? { status } : {};

  const orders = await Order.paginate(query, {
    page,
    limit,
    populate: ["owner", "cartItems", "address"],
    customLabels: { totalDocs: "totalOrders", docs: "orders" },
  });

  return res.status(200).json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

export {
  generateRazorpayOrder,
  verifyRazorpayPayment,
  getOrderById,
  getOrderListAdmin,
  updateOrderStatus,
};

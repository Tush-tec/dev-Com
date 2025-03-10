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
import { isValidObjectId } from 'mongoose';
import { totalmem } from 'os';

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// console.log(process.env.RAZORPAY_KEY_ID);


const orderFulfillmentHelper = async (orderPaymentId, req) => {
  const order = await Order.findOneAndUpdate(
    { razorpayPaymentId: orderPaymentId },
    { $set: { status: "Paid" } },
    { new: true }
  );

  if (!order) {
    throw new ApiError(404, "Order does not exist");
  }

  // Prepare bulk updates for reducing stock
  const bulkStockUpdates = order.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.productId }, // Find product by ID
      update: { $inc: { stock: -item.quantity } }, // Reduce stock
    },
  }));

  await Product.bulkWrite(bulkStockUpdates, { skipValidation: true });

  // Delete cart after order completion
  await Cart.deleteOne({ owner: req.user._id });

  return order;
};


const generateRazorpayOrder = asyncHandler(async (req, res) => {
  const { addressId, paymentMethod } = req.body;

  if (!razorpayInstance) {
    throw new ApiError(500, "Razorpay instance not initialized");
  }

  // Fetch the address
  const address = await Address.findOne({ _id: addressId, owner: req.user._id });
  if (!address) throw new ApiError(404, "Address not found");

  // Fetch user's cart
  const cartAggregation = await Cart.aggregate([
    { $match: { owner: req.user._id } },
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "cartItemsDetails",
      },
    },
  ]);

  const cart = cartAggregation[0];

  if (!cart || !cart.items.length) throw new ApiError(400, "User cart is empty");

  // Format cart items into order schema structure
  const cartItems = cart.items.map((item) => {
    const product = cart.cartItemsDetails.find(p => p._id.toString() === item.productId.toString());

    return {
      productId: item.productId,
      quantity: item.quantity,
      price: product ? product.price : 0,
      name: product ? product.name : "Unknown Product",
      image: product ? product.mainImage : "",
    };
  });

  // Calculate total amount
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Validate Payment Method
  const validPaymentMethods = {
    Online: "Razorpay",
    UPI: "UPI",
    Razorpay: "Razorpay",
"Cash on Delivery": "Cash on Delivery",
  };

  const formattedPaymentMethod = validPaymentMethods[paymentMethod];
  if (!formattedPaymentMethod) throw new ApiError(400, "Invalid payment method");

  // Create Razorpay order
  const orderOptions = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: nanoid(10),
  };

  razorpayInstance.orders.create(orderOptions, async (err, razorpayOrder) => {
    if (err || !razorpayOrder) {
      console.log(err.error.description);
      return res.status(500).json(new ApiResponse(500, err.error.description, err.error.description));
    }

    // Create order in DB
    const newOrder = await Order.create({
      owner: req.user._id,
      cartItems, // Now contains actual product details
      address: address._id,
      paymentMethod: formattedPaymentMethod,
      razorpayPaymentId: razorpayOrder.id,
      totalAmount,
      status: "Pending",
    });

    if (!newOrder) throw new ApiError(500, "Order not created!");

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



const getOrders = asyncHandler(async (req, res) => {
  const { type } = req.params; 
  const { page = 1, limit = 10 } = req.query;

  const matchQuery = { owner: req.user._id };
  let sortStage = null;
  let limitStage = [];


  if (type === "latest") {
    sortStage = { $sort: { createdAt: -1 } };
    limitStage = [{ $limit: 1 }];
  } else if (type === "pending") {
    matchQuery.status = "Pending";
  } else if (type === "delivered") {
    matchQuery.status = "Delivered";
  }

  const pipeline = [
    { $match: matchQuery },
    ...(sortStage ? [sortStage] : []), 
    ...limitStage, 
    {
      $lookup: {
        from: "addresses",
        localField: "address",
        foreignField: "_id",
        as: "addressDetails",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    { $unwind: { path: "$ownerDetails", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$addressDetails", preserveNullAndEmptyArrays: true } },
    { $unwind: "$cartItems" },
    {
      $lookup: {
        from: "products",
        localField: "cartItems.productId",
        foreignField: "_id",
        as: "cartItems.productDetails",
      },
    },
    { $unwind: { path: "$cartItems.productDetails", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$_id",
        totalPrice: { $first: "$totalAmount" },
        status: { $first: "$status" },
        createdAt: { $first: "$createdAt" },
        ownerDetails: { $first: "$ownerDetails" },
        addressDetails: { $first: "$addressDetails" },
        paymentMethod: {$first: "$paymentMethod"},
        cartItems: {
          $push: {
            productId: "$cartItems.productId",
            quantity: "$cartItems.quantity",
            name: "$cartItems.productDetails.name",
            price: "$cartItems.productDetails.price",
            paymentMethod :"$cartItems.productDetails.paymentMethod",
            image: "$cartItems.productDetails.mainImage",
            createdAt : "$cartItems.productDetails.createdAt",


          },
        },
      },
    },
  ];

  const orders = await Order.aggregate(pipeline);

  if (!orders.length) {
    throw new ApiError(404, "No orders found");
  }

  return res.status(200).json(new ApiResponse(200, orders, "Orders retrieved successfully"));
});






const getOrderListAdmin = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  const query = status ? { status } : {};

  const aggregateQuery = Order.aggregate([
      { $match: query },
      { $lookup: { from: "users", localField: "owner", foreignField: "_id", as: "owner" } },
      { $lookup: { from: "addresses", localField: "address", foreignField: "_id", as: "address" } },
      { $lookup: { from: "products", localField: "cartItems.productId", foreignField: "_id", as: "cartItems" } }
  ]);

  const result = await Order.aggregatePaginate(aggregateQuery, {
      page,
      limit,
      customLabels: { totalDocs: "totalOrders", docs: "orders" }
  });

  res.render("adminOrders", { orders: result.orders }); 
  
    // return res.status(200).json(new ApiResponse(200, 
    //   result
    //   , "Orders retrieved successfully"));

});


  // return res.status(200).json(new ApiResponse(200, orders, "Orders retrieved successfully"));



const updateOrderStatus = asyncHandler(async (req, res) => {

  const { orderId } = req.params;
  const { status } = req.body;

  

  let order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order does not exist");

  // console.log("here is ORder", order)
  // console.log("Number of cart items:", order.cartItems.length);

  

  if (order.status === "Delivered") {
    throw new ApiError(400, "Order is already delivered");
  }

  order.status = status;

  console.log(status)
  
  await order.save();
  return res.status(200).json(new ApiResponse(200, { status }, "Order status updated"));
});

const getOrderById = asyncHandler(async (req, res) => {

  const { orderId } = req.params;
  console.log("Order ID", orderId);


  if(!isValidObjectId(orderId)){
    throw new ApiError(
      400,
      "Invalid order id. Please provide a valid order id."
    )
  }
  console.log(isValidObjectId(orderId));
  console.log(orderId);
  

  const order = await Order.findById(orderId).populate("owner cartItems address");

  if (!order) throw new ApiError(404, "Order does not exist");

  res.render("allOrderDetail", {order})

  // return res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));

});

export {
  generateRazorpayOrder,
  verifyRazorpayPayment,
  getOrderById,
  getOrders,
  getOrderListAdmin,
  updateOrderStatus,
};

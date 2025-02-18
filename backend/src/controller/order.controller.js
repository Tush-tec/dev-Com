import Razorpay from 'razorpay';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import crypto from "crypto"
import { Order } from '../models/order.model.js';
import { Address } from '../models/address.model.js';
import { Cart } from '../models/cart.model.js';

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const orderFulfillmentHelper = async (orderPaymentId, req) => {
  const order = await Order.findOneAndUpdate(

    { 
      razorpayPaymentId: orderPaymentId 
    },
    { $set:
       { status: "Paid" } 
    },
    { 
      new: true
    }
  );

  if (!order) {
    throw new ApiError(404, "Order does not exist");
  }

  // Reduce stock after order placement
  const cart = await Cart.findById(order.cartItems).populate("items.product");

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const bulkStockUpdates = cart.items.map((item) => ({
    updateOne: {
      filter: { _id: cartItems._id },
      update: { $inc: { stock: -item.quantity } },
    },
  }));

  await Product.bulkWrite(bulkStockUpdates, { skipValidation: true });
  cart.items = [];
  await cart.save({ validateBeforeSave: false });

  return order;
};

const generateRazorpayOrder = asyncHandler(async (req, res) => {

  const { addressId, paymentMethod } = req.body;
  console.log(addressId);
  

  if (!razorpayInstance) {
    throw new ApiError(500, "Razorpay instance not initialized");
  }

  const address = await Address.findOne(
    { 
      _id: addressId,
       owner: req.user._id 
    }
  );

  if (!address) throw new ApiError(404, "Address not found");

  const cart = await Cart.findOne(
    {
       owner: req.user._id 
    }
  ).populate("cartItems");

  if (!cart || !cart.items.length) throw new ApiError(400, "User cart is empty");

  const totalAmount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const orderOptions = {
    amount: totalAmount * 100, // Convert to paisa
    currency: "INR",
    receipt: nanoid(10),
  };

  razorpayInstance.orders.create(orderOptions, async (err, razorpayOrder) => {

    if (err || !razorpayOrder) {
      return res
      .status(500)
      .json(
        new ApiResponse(
          500,
           null, 
           "Failed to create Razorpay order"
          )
        );
    }

    const newOrder = await Order.create({
      owner: req.user._id,
      cartItems: cart._id,
      address: address._id,
      paymentMethod,
      razorpayPaymentId: razorpayOrder.id,
      totalAmount,
      status: "Pending",
    });
    
    if(!newOrder){
      throw new ApiError(
        500,
        "order is not create!"
      )
    }

    return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        razorpayOrder, 
        "Razorpay order created"
      )
    );
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

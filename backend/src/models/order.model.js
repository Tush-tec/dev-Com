import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const orderSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        productId: { 
          type: Schema.Types.ObjectId, 
          ref: "Product",
          required: true 
        },
        name: String,

        image: String,
        quantity: {
           type: Number, 
           required: true 
          },
        price: { 
          type: Number, required: true
         },
      }
    ],
    address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "Razorpay", "Cash on Delivery"],
      required: true,
    },
    transactionId: {
      type: String,
      default: null, // Allow null for non-UPI payments
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

orderSchema.plugin(mongooseAggregatePaginate);

export const Order = mongoose.model("Order", orderSchema);

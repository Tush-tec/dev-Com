  import mongoose,{Schema} from "mongoose";
  import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


  const orderSchema = new mongoose.Schema(
    {
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      cartItems: [{
        type : Schema.Types.ObjectId,
        ref:"Cart"
      }],
      address: {
      type : Schema.Types.ObjectId,
      ref: "Address"
      },
      paymentMethod: {
        type: String,
        enum: ["UPI", "Razorpay"],
        required: true,
      },
      transactionId: {
        type: String,
        required: function () {
          return this.paymentMethod === "UPI";
        },
      },
      razorpayPaymentId: String,
      totalAmount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
      },
      
    },
    { timestamps: true }
  );


  orderSchema.plugin(mongooseAggregatePaginate)

  export const Order = mongoose.model("Order", orderSchema)
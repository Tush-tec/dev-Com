import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const orderSchema = new Schema(
  {
    orderPrice:{
      type:Number,
      required:true
    },
    discountPrice :{
      type:Number,  
      required:true
    },
    customer :{
      type : Schema.Types.ObjectId,
      ref:"User"
    },
    items:{
      type: [
        {
          ProductId:{
            type: Schema.Types.ObjectId,
            ref: "Product"  
          },
          quantity:{
            type:Number,
            required:true,
            min: [1, "Quantity can not be less then 1."],
            default: 1
          }
        }
      ],
      default:[]
    },
    address:{
      type:Schema.Types.ObjectId,
      ref:"Address"
    },
    status:{
      type:String,
      enum:["pending","shipped","delivered"],
      default:"pending"
    },
    paymentProvider :{
      type:String,
      enum: AvailablePaymentProviders,
    },
    paymentId:{
      type:String,
    },
    isPaymentDone:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true
  }
)

orderSchema.plugin(mongooseAggregatePaginate)

export const Order = mongoose.model("Order", orderSchema)
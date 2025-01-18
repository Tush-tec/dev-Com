import mongoose,{Schema} from "mongoose";


const cartSchema = new Schema(
    {
    owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
            // required:true
        },
        items:[
            {
                productId:{
                    type:Schema.Types.ObjectId,
                    ref:"Product",
                    required:true
                },
                quantity :{
                    type:Number,
                    required:true,
                    min:1
                },
                stock:{
                    type: Number,
                    required: true,
                },
                price:{
                    type:Number,
                    required:true
                },
                name:String,
                image:String
            }
        ],
        totalPrice:{
            type:Number,
            default:0
        },
        isActive:{
            type:Boolean,
            default:true
        },
        sessionId:{
            type:String,
            default:""

        }
    },
    {
        timestamps:true
    }
)

// Calculate the total price before saving

// cartSchema.pre("save", function(next){
//     this.totalPrice = this.items.reduce(
//         (acc, items) => {
//             acc + items.price * items.quantity,
//             0
//         }
//     )
//     next((error)=>{
//         console.error("CartSchema Failed to calculate the result",error.message ||error())
//     })
// })

export const Cart = mongoose.model("Cart",cartSchema)
import mongoose, { mongo, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const addressSchema =  new Schema (
    {

        addressLine:[
            {
                street :{
                    type : String,
                    required : true,
                    trim : true
                },
                AssetNumber:{
                    type: String,
                    required: true,
                    trim : true
                },                             
                district:{
                    type : String,
                    required : true,
                    trim : true
                },
                city:{
                    type : String,
                    required : true,
                    trim : true
                },
                pincode :{
                    type : Number,
                    required : true,
                    min: 100000, 
                    max: 999999, 
                    validate: {
                        validator: function (v) {
                            return /^[1-9][0-9]{5}$/.test(v.toString()); // Example: Validate 6-digit pin codes
                        },
                        message: (props) => `${props.value} is not a valid pincode!`,
                    }
                },

            },
        ],
        state:{
            type:String,
            required:true
        },
        owner :{
            type :Schema.Types.ObjectId,
            ref: "User",
        }
    },
    {
        timestamps: true
    }
)

addressSchema.plugin(mongooseAggregatePaginate);

export const Address = mongoose.model("Adress", addressSchema)


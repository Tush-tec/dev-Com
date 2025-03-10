import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";



const categorySchema = new Schema(
    {
        categoryName :{
            type : String,
            required : true
        },

        owner :{
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

        image:{
            type:String
            
        }
    },
    {
        timestamps: true
    }
)

categorySchema.plugin(mongooseAggregatePaginate)

export const Category = mongoose.model("Category", categorySchema)
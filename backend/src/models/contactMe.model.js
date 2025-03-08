import mongoose, { Schema } from "mongoose";


const contactMeSchema  = new Schema(
    {
        name:{
            type :String,
            required : true
            
        },
        phoneNumber:{
            type :Number,
            required : true
        },
        email :{
            type :String,
            required : true,

        },
        message : {
            type: String,
        }
    }
)

export const ContactMe = mongoose.model("ContactMe", contactMeSchema) 
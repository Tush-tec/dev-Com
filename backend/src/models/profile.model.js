import mongoose,{Schema} from "mongoose";

const profileSchema =  new Schema(
    {
        owner :{
            type: Schema.Types.ObjectId,
            ref:"User"
        },
        firstName :{
            type: String,
            required: true
        },
        lastName:{
            type : String
        },
        phoneNumber :{ 
            type: String,
            required:true
        },

    },
    {
        timestamps: true
    }
)

export const EcomProfile = mongoose.model("EcomProfile", profileSchema)
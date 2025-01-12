import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { EcomProfile } from "./profile.model.js";
import { Cart } from "./cart.model.js";
import { UserRolesEnum,AvailableUserRoles } from "../constant.js";


const userSchema =  new Schema(
    {
        username:{
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: true,
            index: true
        },
        email:{
            type: String,
            lowercase:true,
            trim: true,
            required : true
        },
        fullname:{
            type:String,
            required: true,
            trim: true,
        },
        avatar:{
            type:String,
            required:true
        },
        role: {
            type: String,
            enum: AvailableUserRoles,
            default: UserRolesEnum.USER,
            required: true,
          },
        password:{
            type:String,
            required:true,
        },
        refreshToken:{
            type:String
        }
    },
    {
        timestamps: true
    }
)

// hash  password

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password =  await bcrypt.hash(this.password, 10)
    next()
})

userSchema.pre("save",async function(user,next){

    try {
        const ecomProfile = await EcomProfile.findOne({owner:user._id})
        const cart = await Cart.findOne({owner:user._id})
    
        if(!ecomProfile){
            await EcomProfile.create(
                {
                    owner:user._id
                }
            )
        }
    
        if(!cart){
            await Cart.create(
                {
                    owner:user._id
                }
            )
        }
        next()
    } catch (error) {
     next(error)   
    }

})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

// generate Token,  assign jwt token

userSchema.methods.generateAccessToken =  function(){
    return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.ACCESS_TOKEN_EXPIRE
        }
    )
}

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.REFRESH_TOKEN_EXPIRE
        }
    )
}

export const User = mongoose.model("User",userSchema)
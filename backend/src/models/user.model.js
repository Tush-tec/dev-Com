import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { EcomProfile } from "./profile.model.js";
import { Cart } from "./cart.model.js";
// import { UserRolesEnum,AvailableUserRoles } from "../constant.js";


const userSchema =  new Schema(
    {
        googleId: { 
            type: String, 
            unique: true,
            sparse: true,  
        },
        username:{
            type: String,
            index: true,
            trim: true,
            unique: true,
            lowercase: true

        },
        storedUserName: {
            type: String,
            trim: true,
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
        password:{
            type:String,
            required:true,
            required: function() { return !this.googleId; }
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

userSchema.pre("save", async function(next) {

    if (!this.isModified("password")) return next();

    console.log("Password before hashing:", this.password);

    if (!this.password) throw new Error("Password is undefined before hashing");
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


// userSchema.pre("save", async function (next) {
//     try {
//       const ecomProfile = await EcomProfile.findOne({ owner: this._id });
//       const cart = await Cart.findOne({ owner: this._id });
  
//       if (!ecomProfile) {
//         await EcomProfile.create({
//           owner: this._id,
//         });
//       }
  
//       if (!cart) {
//         await Cart.create({
//           owner: this._id,
//         });
//       }
  
//       next();
//     } catch (error) {
//       next(error);
//     }
//   });
  

userSchema.methods.isPasswordCorrect = async function(password) {
    console.log("Password to compare:", password);
    console.log("Stored password:", this.password);
        if (!this.password) throw new Error("Password hash is missing");
    return await bcrypt.compare(password, this.password);
};


// generate Token,  assign jwt token

userSchema.methods.generateAccessToken =  function(){
    return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email,
            fullname:this.fullname,
            avatar: this.avatar,
            storedUserName:this.storedUserName,

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE
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
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE
        }
    )
}

export const User = mongoose.model("User",userSchema)
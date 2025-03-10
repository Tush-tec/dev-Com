import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { Order } from "../models/order.model.js"
import { Product } from "../models/product.model.js"
import { Category } from "../models/category.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"


// const dashBoardStats = asyncHandler(async(req,res ) =>{

//     const totalUsers = await User.countDocuments()

//     return res
//     .status(200)
//     .json(
        
//         new ApiResponse(
//             201,
//             totalUsers,
//             "Total Users"
//         )
//     );


// })

const dashBoardStats = async(req,res ) =>{
    const totalUsers = await User.countDocuments()
    const totalOrders = await Order.countDocuments()
    const totalProducts = await Product.countDocuments()
    const totalCategories = await Category.countDocuments()
    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            {totalUsers, totalOrders, totalProducts, totalCategories},
            "Dashboard Stats"
            )
            )


}

console.log(dashBoardStats())

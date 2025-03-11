import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const dashBoardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Date calculations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // New Users
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });

    // Orders
    const ordersToday = await Order.countDocuments({ createdAt: { $gte: today } });
    const weeklyOrders = await Order.countDocuments({ createdAt: { $gte: lastWeek } });
    const monthlyOrders = await Order.countDocuments({ createdAt: { $gte: lastMonth } });
    
    const orderStatusCounts = await Order.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    // Revenue calculations
    const totalRevenueData = await Order.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = totalRevenueData.length > 0 ? totalRevenueData[0].totalRevenue : 0;

    const todayRevenueData = await Order.aggregate([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: null, todayRevenue: { $sum: "$totalAmount" } } }
    ]);
    const todayRevenue = todayRevenueData.length > 0 ? todayRevenueData[0].todayRevenue : 0;

    const monthlyRevenueData = await Order.aggregate([
        { $match: { createdAt: { $gte: lastMonth } } },
        { $group: { _id: null, monthlyRevenue: { $sum: "$totalAmount" } } }
    ]);
    const monthlyRevenue = monthlyRevenueData.length > 0 ? monthlyRevenueData[0].monthlyRevenue : 0;

    // Best-selling products
    const bestSellingProducts = await Order.aggregate([
        { $unwind: "$cartItems" },
        { $group: { _id: "$cartItems.productId", totalSold: { $sum: "$cartItems.quantity" } } },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "productDetails" } },
        { $unwind: "$productDetails" }
    ]);

    // Out of stock products
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });4




    // res.render("dashboard",[ {
         
    //         totalUsers,
    //         newUsersToday,
    //         totalOrders,
    //         ordersToday,
    //         weeklyOrders,
    //         monthlyOrders,
    //         totalProducts,
    //         outOfStockProducts,
    //         totalCategories,
    //         totalRevenue,
    //         todayRevenue,
    //         monthlyRevenue,
    //         orderStatusCounts,
    //         bestSellingProducts
        
    // }]);

    return res.status(200).json(
        new ApiResponse(200, {
            totalUsers,
            newUsersToday,
            totalOrders,
            ordersToday,
            weeklyOrders,
            monthlyOrders,
            totalProducts,
            outOfStockProducts,
            totalCategories,
            totalRevenue,
            todayRevenue,
            monthlyRevenue,
            orderStatusCounts,
            bestSellingProducts
        })
    );
});




    
   


export { dashBoardStats };
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const authMiddleware = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", ""); 
        
        console.log("Token from Cookies:", req.cookies?.accessToken);
        console.log("Token from Authorization Header:", req.header("Authorization")?.replace("Bearer ", ""));
        console.log("Extracted Token:", token);

        if (!token) {
            throw new ApiError(401, "Access token is missing. Please log in.");
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            console.error("JWT Verification Error:", error.message);
            throw new ApiError(401, "Invalid or expired access token.");
        }

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "User not found. Token might be invalid or expired.");
        }

        req.user = user;
        console.log("User authenticated:", user);
        next();
    } catch (error) {
        console.error(error?.message || error);
        next(new ApiError(401, error?.message || "Authentication failed"));
    }
});



    
export { authMiddleware };
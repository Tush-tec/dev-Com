import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const authMiddleware = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        // console.log("Token from Cookies:", req.cookies?.accessToken);
        // console.log("Token from Authorization Header:", req.header("Authorization"));
        // console.log("Extracted Token:", token);
        
        if (!token) {
            throw new ApiError(401, "Access token is missing. Please log in.");
        }

        let verifyJwtTokenGetFromCookies;
        try {
            verifyJwtTokenGetFromCookies = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            console.error("JWT Verification Error:", error.message);
            throw new ApiError(401, "Invalid or expired access token.");
        }

        const findUserByDecodedToken = await User.findById(verifyJwtTokenGetFromCookies._id).select(
            "-password -refreshToken"
        );

        if (!findUserByDecodedToken) {
            throw new ApiError(401, "User not found. Token might be invalid or expired.");
        }

        req.user = findUserByDecodedToken;
        console.log("User successfully authenticated:", findUserByDecodedToken);

        next();
    } catch (error) {
        console.error(error?.message || error)
        next(new ApiError(401, error?.message || "Authentication failed"));
    }
});

// Optional: Role-Based Access Control
const verifyPermission = (roles = []) =>
    asyncHandler(async (req, res, next) => {
        if (!req.user?._id) {
            throw new ApiError(401, "Unauthorized request");
        }
        if (roles.includes(req.user?.role)) {
            next();
        } else {
            throw new ApiError(403, "You do not have permission to perform this action.");
        }
    });

export { authMiddleware, verifyPermission };

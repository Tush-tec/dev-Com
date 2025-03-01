import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AvailableUserRoles } from "../constant.js";

const generateAccessAndRefreshTokens = async (userId) => {
  
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error.message || error )
   
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  if (!username || !email || !fullname || !password) {
    throw new ApiError(400, "Please fill all fields");
  }

  const existUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existUser) {
    throw new ApiError(400, "Username or Email already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar");
  }

  const createUser = await User.create({
    username,
    email,
    fullname,
    password,
    avatar: avatar.url,
  });

  const checkUserCreatedorNot = await User.findById(createUser._id).select(
    "-password -refreshToken"
  );

  if (!checkUserCreatedorNot) {
    throw new ApiError(500,checkUserCreatedorNot, "Something went wrong during registration");
  }

  
   return res
   .status(201)
   .json(
    new ApiResponse(
      201,
      checkUserCreatedorNot,
      "User created successfully",
    )
   );
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username and Password are required");
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isValidPassword = await user.isPasswordCorrect(password);

  if (!isValidPassword) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true, 
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(
      new ApiResponse(
        200,
         { loggedInUser, accessToken, refreshToken},
        "User logged in successfully"
      )
    );
});

const getUser = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(400, "User ID is required");
  }

  const userData = await User.aggregate([
    {
      $match: { _id: req.user._id }, // Find the user
    },
    {
      $lookup: {
        from: "orders", // Join with Orders collection
        localField: "_id",
        foreignField: "owner",
        as: "orders",
      },
    },
    {
      $unwind: {
        path: "$orders",
        preserveNullAndEmptyArrays: true, // Keep users even if they have no orders
      },
    },
    {
      $lookup: {
        from: "carts", // Join with CartItems collection
        localField: "cartItems",
        foreignField: "_id",
        as: "cartDetails",
      },
    },
    {
      $lookup: {
        from: "addresses", // Join with Addresses collection
        localField: "orders.address",
        foreignField: "_id",
        as: "orders.addressDetails",
      },
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        email: { $first: "$email" },
        orders: { $push: "$orders" }, // Re-group orders after `$unwind`
      },
    },
    {
      $project: {
        password: 0, // Exclude password field
        "orders.__v": 0, // Exclude unnecessary fields
        "orders.cartDetails.__v": 0,
        "orders.addressDetails.__v": 0,
      },
    },
  ]);

  if (!userData.length) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, { user: [0] }, "User found successfully")
  );
});


const loggedOutUser = asyncHandler(async (req, res) => {

  
  await User.findByIdAndUpdate(
    req.user?._id,

    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged-Out"));
});


const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName } = req.body;

  if (!fullName) {
    throw new ApiError(400, "Please provide the fullName");
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  } 

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { fullName } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Full name updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(404, "We Cannot Fetch Your Avatar Request");
  }

  const user = await User.findById(req.user?._id);
  const currentAvatarUrl = user?.path;

  if (currentAvatarUrl) {
    await cloudinary.uploader.destroy(publicId);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw ApiError(400, "Error While Uploading avatar On Cloudinary");
  }

  const updateUser = await User.findByIdAndUpdate(
    req.user?._id,

    {
      $set: {
        avatar: avatar?.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, updateUser, "CoverImage update Successfully.")
    );
});

// const refereshAccessToken = asyncHandler(async (req, res) => {
//   const incomingRefreshToken =
//     req.cookies.refreshToken || req.body.refreshToken;

//   if (!incomingRefreshToken) {
//     throw new ApiError(401, "unauthorized Request");
//   }

//   const decodedToken = jwt.verify(
//     incomingRefreshToken,
//     process.env.ACCESS_TOKEN_SECRET
//   );

//   const user = await User.findById(decodedToken?._id);

//   if (!user) {
//     throw new ApiError(401, "invalid Refresh-Token");
//   }

//   if (incomingRefreshToken !== user?.refreshToken) {
//     throw new ApiError(401, "Refresh Token is expired or used.");
//   }

//   // const { accessToken, newrefreshToken } = await generateAccessAndRefreshTokens(
//   //  user._id
//   // );

//   const options = {
//     httpOnly: true,
//     secure: true,
//   };

//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", newrefreshToken)
//     .json(
//       new ApiResponse(
//         200,
//         "AccessToken Refresh Successfully"
//       )
//     );
// });

const changeCurrentUserPassword = asyncHandler(async (req, res) => {

  const { oldPassword, newPassword, confirmPassword } = req.body;

// if(!oldPassword ||  !newPassword || !confirmPassword){
//   throw new ApiError(
//     400,
//     "Please fill all fields to change password"
//   )
// }

  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(404, "User not found");
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(
      400,
      "Invalid User Password, Check Your Password and tryAgain!"
    );
  } 

  user.password = newPassword;

  if (newPassword !== confirmPassword) {
    throw new  ApiError(401, "Password Not Match, Please Check and TryAgain!");
  }

  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200,  newPassword , "Password Change SuccessFully!")
    );
});

const updateUserRole = asyncHandler(async(req,res) => {
  const {userId, role } = req.body

  if(!AvailableUserRoles.includes(role)){
    throw new ApiError(
      404,
      "Role is not found for User"
    )
  }

  const user = await User.findById(userId)

  if(!user){
    throw new ApiError(
      404,
      "User Not Found"
    )
  }

  user.role = role

  await user.save()

  return res
  .status(200)
  .json(
    new ApiResponse(200, user, "User Role is Successfully Assign!")
  );
  

})

export {
  generateAccessAndRefreshTokens,
  registerUser,
  loginUser,
  getUser,
  loggedOutUser,
  updateAccountDetails,
  updateUserAvatar,
  // refereshAccessToken,
  changeCurrentUserPassword,
  updateUserRole
};

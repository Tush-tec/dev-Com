import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import { AvailableUserRoles } from "../constant.js";

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

  const isValidUsername = (username) => /^[a-zA-Z][a-zA-Z0-9_]{3,29}[a-zA-Z0-9]$/.test(username);

  if (!isValidUsername(username)) {
    throw new ApiError(
      400,
      "Username must start with a letter, contain only letters, numbers, or underscores, and be 4-30 characters long."
    );
  }



  const validatePassword = (password) => {
    let errors = [];
  
    if (password.length < 5) errors.push("Password must be at least 5 characters long.");
    if (!/[a-zA-Z]/.test(password)) errors.push("Password must contain at least one letter (A-Z or a-z).");
    if (!/\d/.test(password)) errors.push("Password must contain at least one number (0-9).");
    if (!/[@$!%*?&]/.test(password)) errors.push("Password must contain at least one special character (@$!%*?&).");
  
    return errors;
  };
  

  const errors = validatePassword(password);

  if (errors.length > 0) {
    throw new ApiError(400, errors.join(" "));
  }
  


  const existUser = await User.findOne({ username });

  
  if (existUser) {
    throw new ApiError(400, "Username already exists");
  }


  const existEmail = await User.findOne({ email });
  if (existEmail) {
    throw new ApiError(400, "Email already exists");
  }


  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }


  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar");
  }


  let storedUserName;
  let isUnique = false;

  while (!isUnique) {
    const assignRandomLetters = Math.random().toString(36).substring(2, 5).toUpperCase();
    const assignRandomNumber = Math.floor(100 + Math.random() * 9000);

    const usernameVariations = [
      `${username}_${assignRandomLetters}${assignRandomNumber}`,
      `${username}_${assignRandomNumber}${assignRandomLetters}`,
      `${username}_${assignRandomLetters.charAt(0)}${assignRandomNumber}${assignRandomLetters.charAt(1) || ''}`,
      `${username}_${assignRandomLetters.split('').reverse().join('')}`,
      `${username}_${assignRandomLetters}${assignRandomLetters.split('').reverse().join('')}`,
    ];

    storedUserName = usernameVariations[Math.floor(Math.random() * usernameVariations.length)];


    const existingStoredUser = await User.findOne({ username: storedUserName });
    if (!existingStoredUser) {
      isUnique = true;
    }
  }

  try {

    const createUser = await User.create({
      username,
      storedUserName, 
      email,
      fullname,
      password,
      avatar: avatar.url,
    });


    const checkUserCreatedorNot = await User.findById(createUser._id).select(
      "-password -refreshToken"
    );

    if (!checkUserCreatedorNot) {
      throw new ApiError(500, "Something went wrong during registration");
    }

    return res.status(201).json(
      new ApiResponse(201, checkUserCreatedorNot, "User created successfully")
    );

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json(
        new ApiResponse(400, null, "Username is already taken. Please try again.")
      );
    }
    throw new ApiError(500, "Something went wrong during registration");
  }
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

    const cookieOptions = {
      httpOnly: false,
      secure: true, 
      sameSite: "None", 
      path: '/' 
  };
  

    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken, )
      .json(
        new ApiResponse(
          200,
          { loggedInUser, accessToken, refreshToken},
          "User logged in successfully"
        )
      );
  });

const getIndividualUser = asyncHandler(async(req,res) =>{
  const { id } = req.params;  
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user, 
        "User found"
      )
    );
})


const getUser = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(400, "User ID is required");
  }

  const userData = await User.aggregate([
    {
      $match: { _id: req.user._id }, 
    },
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "owner",
        as: "orders",
      },
    },
    {
      $lookup: {
        from: "products", // Change from "orders" to "products"
        localField: "orders.cartItems.productId", // Accessing inside orders
        foreignField: "_id",
        as: "cartDetails",
      },
    },
    {
      $lookup: {
        from: "addresses",
        localField: "orders.address",
        foreignField: "_id",
        as: "addressDetails",
      },
    },
    {
      $addFields: {
        "orders.cartDetails": "$cartDetails",
        "orders.addressDetails": "$addressDetails",
      },
    },
    {
      $project: {
        password: 0,
        "orders.__v": 0,
        "orders.cartDetails.__v": 0,
        "orders.addressDetails.__v": 0,
      },
    },
  ]);

  if (!userData.length) {
    throw new ApiError(404, "User not found");
  }


  return res.status(200).json(
    new ApiResponse(200, { userData: userData[0] }, "User found successfully")
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
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
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

  console.log(avatarLocalPath)
  

  if (!avatarLocalPath) {
    throw new ApiError(404, "We Cannot proceed with your update Avatar request")
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

if(!oldPassword ||  !newPassword || !confirmPassword){
  throw new ApiError(
    400,
    "Please fill all fields to change password"
  )
}

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

  if (!user.storedUserName) {
    user.storedUserName = user.username; // or any default logic
  }

  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200,  newPassword , "Password Change SuccessFully!")
    );
});

// const updateUserRole = asyncHandler(async(req,res) => {
//   const {userId, role } = req.body

//   if(!AvailableUserRoles.includes(role)){
//     throw new ApiError(
//       404,
//       "Role is not found for User"
//     )
//   }

//   const user = await User.findById(userId)

//   if(!user){
//     throw new ApiError(
//       404,
//       "User Not Found"
//     )
//   }

//   user.role = role

//   await user.save()

//   return res
//   .status(200)
//   .json(
//     new ApiResponse(200, user, "User Role is Successfully Assign!")
//   );
  

// })

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
  // updateUserRole,
  getIndividualUser
};

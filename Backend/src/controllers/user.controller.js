import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

 

const hashPassword = asyncHandler(async () => {
 
  const saltRounds = 12

  return await bcrypt.hash(password, saltRounds)

})

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password, roles } =
    req.body;
  //console.log("email: ", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  //console.log(req.files);
 const hashedPassword = hashPassword(password)

  const lowercaseUsername = username ? username.toLowerCase() : null;
  const user = await User.create({
    fullName,
    email, 
    password: hashedPassword,
    username: lowercaseUsername,
    roles
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) =>{
 

  const {email, username, password} = req.body
  console.log("Request body:", req.body);
  console.log(email);

  if (!username && !email) {
    return res.status(400).json({
      success: false,
      message: "Username or email is required",
    });
  }
  

  const user = await User.findOne({
      $or: [{username}, {email}]
  })

  console.log(user.username)

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User does not exist",
    });
  }

 const isPasswordValid = await user.isPasswordCorrect(password)

 if (!isPasswordValid) {
  return res.status(401).json({
    success: false,
    message: "Invalid user credentials",
  });
}

 const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)


  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  
  //  const accessToken = jwt.sign(
  //     {
  //       UserInfo: {
  //         _id: user._id,
  //         email: user.email,
  //         username: user.username,
  //         fullName: user.fullName,
  //         roles: user.roles,
  //       },
  //     },
  //     process.env.ACCESS_TOKEN_SECRET,
  //     {
  //       expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  //     }
  //   );
  
  
  //   const refreshToken = jwt.sign(
  //     {
  //       _id: user._id,
        
  //     },
  //     process.env.REFRESH_TOKEN_SECRET,
  
  //     {
  //       expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  //     }
  //   );
  
    // user.refreshToken = refreshToken; // Save refresh token to user document
  await user.save();

  const options = {
      httpOnly: true,
      secure: true
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
      new ApiResponse(
          200, 
          {
            accessToken, refreshToken
          },
          "User logged In Successfully"
      )
  )

})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
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
    .json(new ApiResponse(200, {}, "User logged Out"));
});

export { registerUser, loginUser, logoutUser };

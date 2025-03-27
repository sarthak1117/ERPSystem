import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// const allowedRoles = ["Student", "Staff", "Admin"];

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      token: { type: String },
      expiry: { type: Date }, // Optional, helps with token expiration tracking
    },
    roles: [
      {
        type: String,
        required: true,
        // enum: allowedRoles,
      },
    ],
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null }, // For soft deletion
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware for hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance method to verify password
userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

// Instance method to generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
      roles: this.roles, // Include roles in the token payload
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Instance method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);


// // models/user.model.js
// import mongoose, { Schema } from "mongoose";
// import bcrypt from "bcrypt";

// const userSchema = new Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       index: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     fullName: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"],
//     },
//     roles: {
//       type: [String],
//       default: ["Student"],
//     },
//     address: {
//       current: { type: String },
//       permanent: { type: String },
//     },
//     phoneNumber: String,
//     EmergencyContactNumber: String,
//     Gender: String,
//     DateOfBirth: Date,
//     MaritalStatus: String,
//     FatherName: String,
//     MotherName: String,
//     Qualification: String,
//     StaffID: String,
//     Designation: String,
//     Department: String,
//     EPFNo: String,
//     ContractType: String,
//     WorkShift: String,
//     Location: String,
//     DateOfJoining: Date,
//     refreshToken: { type: String },
//   },
//   {
//     timestamps: true,
//   }
// );

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// userSchema.methods.isPasswordCorrect = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

// export const User = mongoose.model("User", userSchema);

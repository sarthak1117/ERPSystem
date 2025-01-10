import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js"; // Optional if middleware used for async errors

const router = express.Router();

// Route for user registration
router.post("/register", asyncHandler(registerUser));

// Route for user login
router.post("/login", asyncHandler(loginUser));

// Route for user logout
router.post("/logout", asyncHandler(logoutUser));

export default router;

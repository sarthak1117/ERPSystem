import { LeaveType } from "../models/leave.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// Create a Leave Type
const createLeaveType = asyncHandler(async (req, res, next) => {
  const { Name } = req.body;
  try {
    const newLeaveType = await LeaveType.create({ Name });
    res.status(201).json(new ApiResponse(201, newLeaveType, "Leave type created successfully"));
  } catch (error) {
    next(new ApiError(500, "Error creating leave type", [error.message]));
  }
});

// Get all Leave Types
const getLeaveTypes = asyncHandler(async (req, res, next) => {
  try {
    const leaveTypes = await LeaveType.find();
    res.status(200).json(new ApiResponse(200, leaveTypes, "Leave types fetched successfully"));
  } catch (error) {
    next(new ApiError(500, "Error fetching leave types", [error.message]));
  }
});

// Get a single Leave Type by ID
const getLeaveTypeById = asyncHandler(async (req, res, next) => {
  try {
    const leaveType = await LeaveType.findById(req.params.id);
    if (!leaveType) {
      return next(new ApiError(404, "Leave type not found"));
    }
    res.status(200).json(new ApiResponse(200, leaveType, "Leave type fetched successfully"));
  } catch (error) {
    next(new ApiError(500, "Error fetching leave type", [error.message]));
  }
});

// Update a Leave Type by ID
const updateLeaveType = asyncHandler(async (req, res, next) => {
  const { Name } = req.body;
  try {
    const updatedLeaveType = await LeaveType.findByIdAndUpdate(
      req.params.id,
      { Name },
      { new: true, runValidators: true }
    );
    if (!updatedLeaveType) {
      return next(new ApiError(404, "Leave type not found"));
    }
    res.status(200).json(new ApiResponse(200, updatedLeaveType, "Leave type updated successfully"));
  } catch (error) {
    next(new ApiError(500, "Error updating leave type", [error.message]));
  }
});

// Delete a Leave Type by ID
const deleteLeaveType = asyncHandler(async (req, res, next) => {
  try {
    const deletedLeaveType = await LeaveType.findByIdAndDelete(req.params.id);
    if (!deletedLeaveType) {
      return next(new ApiError(404, "Leave type not found"));
    }
    res.status(200).json(new ApiResponse(200, deletedLeaveType, "Leave type deleted successfully"));
  } catch (error) {
    next(new ApiError(500, "Error deleting leave type", [error.message]));
  }
});

export { createLeaveType, getLeaveTypes, getLeaveTypeById, updateLeaveType, deleteLeaveType };

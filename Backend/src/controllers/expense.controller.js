import asyncHandler from "../middleware/asyncHandler";
import ExpenseHead from "../models/expenseHeadModel";
import { ApiResponse, ApiError } from "../utils/apiResponses";

// Create Expense Head
const createExpenseHead = asyncHandler(async (req, res, next) => {
    const { expenseHead, description } = req.body;

    try {
        const newExpenseHead = new ExpenseHead({ expenseHead, description });

        await newExpenseHead.save();


        res.status(201).json(new ApiResponse(201, newExpenseHead, "Expense head created successfully"));
    } catch (error) {
        next(new ApiError(500, "Error creating expense head", [error.message]));
    }
});

// Get All Expense Heads
const getExpenseHeads = asyncHandler(async (req, res, next) => {
    try {
        const expenseHeads = await ExpenseHead.find();
        res.status(200).json(new ApiResponse(200, expenseHeads, "Expense heads fetched successfully"));
    } catch (error) {
        next(new ApiError(500, "Error fetching expense heads", [error.message]));
    }
});

// Update Expense Head
const updateExpenseHead = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { expenseHead, description } = req.body;

    try {
        const updatedExpenseHead = await ExpenseHead.findByIdAndUpdate(
            id,
            { expenseHead, description },
            { new: true, runValidators: true }
        );

        if (!updatedExpenseHead) {
            return next(new ApiError(404, "Expense head not found"));
        }

        res.status(200).json(new ApiResponse(200, updatedExpenseHead, "Expense head updated successfully"));
    } catch (error) {
        next(new ApiError(500, "Error updating expense head", [error.message]));
    }
});

// Delete Expense Head
const deleteExpenseHead = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedExpenseHead = await ExpenseHead.findByIdAndDelete(id);

        if (!deletedExpenseHead) {
            return next(new ApiError(404, "Expense head not found"));
        }

        res.status(200).json(new ApiResponse(200, deletedExpenseHead, "Expense head deleted successfully"));
    } catch (error) {
        next(new ApiError(500, "Error deleting expense head", [error.message]));
    }
});

export { createExpenseHead, getExpenseHeads, updateExpenseHead, deleteExpenseHead };

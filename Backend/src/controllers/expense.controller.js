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

const createExpense = asyncHandler(async (req, res, next) => {
    const { expenseHead, invoiceNumber, name, date, amount } = req.body;
  
    // Verify expenseHead exists
    const existingExpenseHead = await ExpenseHead.findById(expenseHead);
    if (!existingExpenseHead) {
      return next(new ApiError(404, "Expense Head not found"));
    }
  
    let documentUrl = null;
  
    // Handle document upload if provided
    if (req.files && req.files.document && Array.isArray(req.files.document) && req.files.document.length > 0) {
      const documentLocalPath = req.files.document[0].path;
      documentUrl = await uploadOnCloudinary(documentLocalPath);
    }
  
    try {
      // Create new expense entry
      const newExpense = await Expense.create({
        expenseHead,
        invoiceNumber,
        name,
        date,
        amount,
        document: documentUrl,
      });
  
      res.status(201).json(new ApiResponse(201, newExpense, "Expense entry created successfully"));
    } catch (error) {
      next(new ApiError(500, "Error creating expense entry", [error.message]));
    }
  });
  
  // Get all expenses
  const getExpenses = asyncHandler(async (req, res, next) => {
    try {
      const expenses = await Expense.find().populate("expenseHead", "expenseHead description");
      res.status(200).json(new ApiResponse(200, expenses, "Expenses fetched successfully"));
    } catch (error) {
      next(new ApiError(500, "Error fetching expenses", [error.message]));
    }
  });
  
  // Get a single expense by ID
  const getExpenseById = asyncHandler(async (req, res, next) => {
    try {
      const expense = await Expense.findById(req.params.id).populate("expenseHead", "expenseHead description");
      if (!expense) {
        return next(new ApiError(404, "Expense not found"));
      }
      res.status(200).json(new ApiResponse(200, expense, "Expense fetched successfully"));
    } catch (error) {
      next(new ApiError(500, "Error fetching expense", [error.message]));
    }
  });
  
  // Update an expense by ID
  const updateExpense = asyncHandler(async (req, res, next) => {
    const { expenseHead, invoiceNumber, name, date, amount } = req.body;
  
    // Verify expenseHead exists if provided
    if (expenseHead) {
      const existingExpenseHead = await ExpenseHead.findById(expenseHead);
      if (!existingExpenseHead) {
        return next(new ApiError(404, "Expense Head not found"));
      }
    }
  
    let documentUrl = null;
  
    // Handle document upload if provided
    if (req.files && req.files.document && Array.isArray(req.files.document) && req.files.document.length > 0) {
      const documentLocalPath = req.files.document[0].path;
      documentUrl = await uploadOnCloudinary(documentLocalPath);
    }
  
    try {
      // Find and update expense entry
      const updatedExpense = await Expense.findByIdAndUpdate(
        req.params.id,
        { expenseHead, invoiceNumber, name, date, amount, document: documentUrl || undefined },
        { new: true, runValidators: true }
      );
  
      if (!updatedExpense) {
        return next(new ApiError(404, "Expense not found"));
      }
  
      res.status(200).json(new ApiResponse(200, updatedExpense, "Expense updated successfully"));
    } catch (error) {
      next(new ApiError(500, "Error updating expense", [error.message]));
    }
  });
  
  // Delete an expense by ID
  const deleteExpense = asyncHandler(async (req, res, next) => {
    try {
      const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
      if (!deletedExpense) {
        return next(new ApiError(404, "Expense not found"));
      }
      res.status(200).json(new ApiResponse(200, deletedExpense, "Expense deleted successfully"));
    } catch (error) {
      next(new ApiError(500, "Error deleting expense", [error.message]));
    }
  });


export { createExpenseHead, getExpenseHeads, updateExpenseHead, deleteExpenseHead,  createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense };

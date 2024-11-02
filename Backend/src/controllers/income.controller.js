import { asyncHandler } from "../utils/asyncHandler";
import { Income, IncomeHead } from "../models/incomeModel";
import { ApiResponse, ApiError } from "../utils/apiResponses";

const createIncomeHead = asyncHandler(async (req, res, next) => {
    const { incomeHead, description } = req.body;
    
    try {
        const newIncomeHead = new IncomeHead({ incomeHead, description });

        await newIncomeHead.save();


        res.status(201).json(new ApiResponse(201, newIncomeHead, "Income head created successfully"));
    } catch (error) {
        next(new ApiError(500, "Error creating income head", [error.message]));
    }
});


const getIncomeHeads = asyncHandler(async (req, res, next) => {
    try {
        const incomeHeads = await IncomeHead.find();
        res.status(200).json(new ApiResponse(200, incomeHeads, "Income heads fetched successfully"));
    } catch (error) {
        next(new ApiError(500, "Error fetching income heads", [error.message]));
    }
});

// Update Income Head
const updateIncomeHead = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { incomeHead, description } = req.body;

    try {
        const updatedIncomeHead = await IncomeHead.findByIdAndUpdate(
            id,
            { incomeHead, description },
            { new: true, runValidators: true }
        );

        if (!updatedIncomeHead) {
            return next(new ApiError(404, "Income head not found"));
        }

        res.status(200).json(new ApiResponse(200, updatedIncomeHead, "Income head updated successfully"));
    } catch (error) {
        next(new ApiError(500, "Error updating income head", [error.message]));
    }
});

// Delete Income Head
const deleteIncomeHead = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedIncomeHead = await IncomeHead.findByIdAndDelete(id);

        if (!deletedIncomeHead) {
            return next(new ApiError(404, "Income head not found"));
        }

        res.status(200).json(new ApiResponse(200, deletedIncomeHead, "Income head deleted successfully"));
    } catch (error) {
        next(new ApiError(500, "Error deleting income head", [error.message]));
    }
});

import asyncHandler from "../middleware/asyncHandler";



// Create Income
const createIncome = asyncHandler(async (req, res, next) => {
    const { incomeHead, invoiceNumber, name, date, amount, description } = req.body;
  
    // Verify incomeHead exists
    const existingIncomeHead = await IncomeHead.findById(incomeHead);
    if (!existingIncomeHead) {
      return next(new ApiError(404, "Income Head not found"));
    }
  
    let documentUrl = null;
  
    // Handle document upload
    if (req.files && req.files.document && Array.isArray(req.files.document) && req.files.document.length > 0) {
      const documentLocalPath = req.files.document[0].path;
      documentUrl = await uploadOnCloudinary(documentLocalPath);
    }
  
    try {
      // Create new income entry
      const newIncome = await Income.create({
        incomeHead,
        invoiceNumber,
        name,
        date,
        amount,
        document: documentUrl,
        description
      });
  
      res.status(201).json(new ApiResponse(201, newIncome, "Income entry created successfully"));
    } catch (error) {
      next(new ApiError(500, "Error creating income entry", [error.message]));
    }
  });

// Get All Income Entries
const getIncomes = asyncHandler(async (req, res, next) => {
  try {
    const incomes = await Income.find().populate("incomeHead", "incomeHead");
    res.status(200).json(new ApiResponse(200, incomes, "Income entries fetched successfully"));
  } catch (error) {
    next(new ApiError(500, "Error fetching income entries", [error.message]));
  }
});

// Get Single Income Entry by ID
const getIncomeById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const income = await Income.findById(id).populate("incomeHead", "incomeHead");
    if (!income) {
      return next(new ApiError(404, "Income entry not found"));
    }
    res.status(200).json(new ApiResponse(200, income, "Income entry fetched successfully"));
  } catch (error) {
    next(new ApiError(500, "Error fetching income entry", [error.message]));
  }
});

// Update Income Entry
const updateIncome = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { incomeHead, invoiceNumber, name, date, amount, document, description } = req.body;

  // Verify incomeHead exists
  if (incomeHead) {
    const existingIncomeHead = await IncomeHead.findById(incomeHead);
    if (!existingIncomeHead) {
      return next(new ApiError(404, "Income Head not found"));
    }
  }

  try {
    const updatedIncome = await Income.findByIdAndUpdate(
      id,
      { incomeHead, invoiceNumber, name, date, amount, document, description },
      { new: true, runValidators: true }
    ).populate("incomeHead", "incomeHead");

    if (!updatedIncome) {
      return next(new ApiError(404, "Income entry not found"));
    }

    res.status(200).json(new ApiResponse(200, updatedIncome, "Income entry updated successfully"));
  } catch (error) {
    next(new ApiError(500, "Error updating income entry", [error.message]));
  }
});

// Delete Income Entry
const deleteIncome = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedIncome = await Income.findByIdAndDelete(id);
    if (!deletedIncome) {
      return next(new ApiError(404, "Income entry not found"));
    }

    res.status(200).json(new ApiResponse(200, deletedIncome, "Income entry deleted successfully"));
  } catch (error) {
    next(new ApiError(500, "Error deleting income entry", [error.message]));
  }
});





  export {createIncomeHead, getIncomeHeads, updateIncomeHead, deleteIncomeHead, createIncome, getIncomes, getIncomeById, updateIncome, deleteIncome}
  
  // Upd
import { asyncHandler } from "../utils/asyncHandler.js";
import { Income, IncomeHead } from "../models/income.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
// Create Income Head


const createIncomeHead = asyncHandler(async (req, res, next) => {
  const { IncomeHead: incomeHeadName, Description } = req.body;

  try {
    const newIncomeHead = await IncomeHead.create({ IncomeHead: incomeHeadName, Description });

    res
      .status(201)
      .json(new ApiResponse(201, newIncomeHead, "Income head created successfully"));
  } catch (error) {
    next(new ApiError(500, "Error creating income head", [error.message]));
  }
});

// Get All Income Heads
const getIncomeHeads = asyncHandler(async (req, res, next) => {
  try {
    const incomeHeads = await IncomeHead.find();
    res
      .status(200)
      .json(new ApiResponse(200, incomeHeads, "Income heads fetched successfully"));
  } catch (error) {
    next(new ApiError(500, "Error fetching income heads", [error.message]));
  }
});

// Update Income Head
const updateIncomeHead = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { IncomeHead: incomeHeadName, Description } = req.body;

  try {
    const updatedIncomeHead = await IncomeHead.findByIdAndUpdate(
      id,
      { IncomeHead: incomeHeadName, Description },
      { new: true, runValidators: true }
    );

    if (!updatedIncomeHead) {
      return next(new ApiError(404, "Income head not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedIncomeHead, "Income head updated successfully"));
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

    res
      .status(200)
      .json(new ApiResponse(200, deletedIncomeHead, "Income head deleted successfully"));
  } catch (error) {
    next(new ApiError(500, "Error deleting income head", [error.message]));
  }
});

// Create Income
const createIncome = asyncHandler(async (req, res, next) => {
  const { IncomeHead: incomeHeadId, InvoiceNumber, Name, Date, Amount, Description } = req.body;

  try {
    // Verify the referenced IncomeHead exists
    const incomeHead = await IncomeHead.findById(incomeHeadId);
    if (!incomeHead) {
      return next(new ApiError(404, "Income head not found"));
    }

    let documentUrl = null;

    // Handle document upload
    if (req.files?.document?.length) {
      const documentLocalPath = req.files.document[0].path;
      documentUrl = await uploadOnCloudinary(documentLocalPath);
    }

    const newIncome = await Income.create({
      IncomeHead: incomeHeadId,
      InvoiceNumber,
      Name,
      Date,
      Amount,
      Document: documentUrl,
      Description,
    });

    res.status(201).json(new ApiResponse(201, newIncome, "Income entry created successfully"));
  } catch (error) {
    next(new ApiError(500, "Error creating income entry", [error.message]));
  }
});

// Get All Incomes
const getIncomes = asyncHandler(async (req, res, next) => {
  try {
    const incomes = await Income.find().populate("IncomeHead", "IncomeHead");
    res.status(200).json(new ApiResponse(200, incomes, "Income entries fetched successfully"));
  } catch (error) {
    next(new ApiError(500, "Error fetching income entries", [error.message]));
  }
});

// Get Income by ID
const getIncomeById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const income = await Income.findById(id).populate("IncomeHead", "IncomeHead");

    if (!income) {
      return next(new ApiError(404, "Income entry not found"));
    }

    res.status(200).json(new ApiResponse(200, income, "Income entry fetched successfully"));
  } catch (error) {
    next(new ApiError(500, "Error fetching income entry", [error.message]));
  }
});

// Update Income
const updateIncome = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { IncomeHead: incomeHeadId, InvoiceNumber, Name, Date, Amount, Document, Description } =
    req.body;

  try {
    if (incomeHeadId) {
      const incomeHead = await IncomeHead.findById(incomeHeadId);
      if (!incomeHead) {
        return next(new ApiError(404, "Income head not found"));
      }
    }

    const updatedIncome = await Income.findByIdAndUpdate(
      id,
      { IncomeHead: incomeHeadId, InvoiceNumber, Name, Date, Amount, Document, Description },
      { new: true, runValidators: true }
    ).populate("IncomeHead", "IncomeHead");

    if (!updatedIncome) {
      return next(new ApiError(404, "Income entry not found"));
    }

    res.status(200).json(new ApiResponse(200, updatedIncome, "Income entry updated successfully"));
  } catch (error) {
    next(new ApiError(500, "Error updating income entry", [error.message]));
  }
});

// Delete Income
const deleteIncome = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedIncome = await Income.findByIdAndDelete(id);

    if (!deletedIncome) {
      return next(new ApiError(404, "Income entry not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, deletedIncome, "Income entry deleted successfully"));
  } catch (error) {
    next(new ApiError(500, "Error deleting income entry", [error.message]));
  }
});

export {
  createIncomeHead,
  getIncomeHeads,
  updateIncomeHead,
  deleteIncomeHead,
  createIncome,
  getIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
};

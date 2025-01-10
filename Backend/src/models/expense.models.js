import mongoose from "mongoose";

// Define schema for Expense Head
const expenseHeadSchema = new mongoose.Schema({
  ExpenseHead: {  // Changed to camelCase for consistency
    type: String,
    required: true,
    trim: true,  // Removes any leading or trailing whitespace
  },
  Description: {
    type: String,
    trim: true,
  },
});

// Define schema for Expense
const expenseSchema = new mongoose.Schema({

  ExpenseHead: {  // Referencing expenseHeadSchema
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpenseHead',
    required: true,
  },
  InvoiceNumber: {
    type: Number,
    trim: true,
  },
  Name: {  // Changed to camelCase for consistency
    type: String,
    required: true,
    trim: true,
  },
  Date: {  // Changed to camelCase for consistency
    type: Date,
    default: Date.now,  // Default to current date if not provided
  },
  Amount: {
    type: Number,
    required: true,
    min: 0,  // Ensures amount is non-negative
  },
  Document: {
    type: String,
    default: null,
    trim: true,
  },
}, { timestamps: true });  // Adds createdAt and updatedAt fields

// Export the models

export const ExpenseHead = mongoose.model('ExpenseHead', expenseHeadSchema);
export const Expense = mongoose.model('Expense', expenseSchema);

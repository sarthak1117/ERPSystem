import mongoose from "mongoose";

const incomeHeadSchema = new mongoose.Schema({
    IncomeHead: {  // Changed to camelCase for consistency
      type: String,
      required: true,
      trim: true,  // Removes any leading or trailing whitespace
    },
    Description: {
      type: String,
      trim: true,
    },
  },{ timestamps: true });

  const incomeSchema = new mongoose.Schema({


    IncomeHead: {  // Referencing incomeHeadSchema
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IncomeHead',
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
    Description: {
        type: String,
        trim: true,
      },
  }, { timestamps: true }); 



export  const IncomeHead = mongoose.model('IncomeHead', incomeHeadSchema);

export const Income = mongoose.model('Income', incomeSchema);

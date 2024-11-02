import mongoose from "mongoose";

const incomeHeadSchema = new mongoose.Schema({
    incomeHead: {  // Changed to camelCase for consistency
      type: String,
      required: true,
      trim: true,  // Removes any leading or trailing whitespace
    },
    description: {
      type: String,
      trim: true,
    },
  },{ timestamps: true });

  const incomeSchema = new mongoose.Schema({


    incomeHead: {  // Referencing incomeHeadSchema
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IncomeHead',
      required: true,
    },
    invoiceNumber: {
      type: Number,
      trim: true,
    },
    name: {  // Changed to camelCase for consistency
      type: String,
      required: true,
      trim: true,
    },
    date: {  // Changed to camelCase for consistency
      type: Date,
      default: Date.now,  // Default to current date if not provided
    },
    amount: {
      type: Number,
      required: true,
      min: 0,  // Ensures amount is non-negative
    },
    document: {
      type: String,
      default: null,
      trim: true,
    },
    description: {
        type: String,
        trim: true,
      },
  }, { timestamps: true }); 



export  const IncomeHead = mongoose.model('IncomeHead', incomeHeadSchema);

export const Income = mongoose.model('Income', incomeSchema);

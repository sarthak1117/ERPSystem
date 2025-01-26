import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  paymentAmount: {
    type: Number,
    required: true,
  },
  paymentMode: {
    type: String,
    enum: ['check', 'cash', 'transfer to bank'],
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  note: {
    type: String,
    required: false,
  },
}, { timestamps: true });

const payrollSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  deductions: [
    {
      type: String,
      amount: Number,
    },
  ],
  earnings: [
    {
      type: String,
      amount: Number,
    },
  ],
  payrollSummary: {
    basicSalary: {
      type: Number,
      required: true,
    },
    totalEarnings: Number,
    totalDeductions: Number,
    grossSalary: Number,
    tax: Number,
    netSalary: Number,
  },
}, {
  timestamps: true,
});

payrollSchema.pre('save', function (next) {
  const payroll = this;
  
  // Calculate total earnings and deductions
  payroll.payrollSummary.totalEarnings = payroll.earnings.reduce((acc, item) => acc + item.amount, 0);
  payroll.payrollSummary.totalDeductions = payroll.deductions.reduce((acc, item) => acc + item.amount, 0);

  // Calculate gross salary: (basic salary + total earnings) - total deductions
  payroll.payrollSummary.grossSalary = payroll.payrollSummary.basicSalary + payroll.payrollSummary.totalEarnings - payroll.payrollSummary.totalDeductions;

  // Calculate net salary: gross salary - tax
  payroll.payrollSummary.netSalary = payroll.payrollSummary.grossSalary - payroll.payrollSummary.tax;

  next();
});

const Payroll = mongoose.model('Payroll', payrollSchema);
const Payment = mongoose.model('Payment', paymentSchema);

export { Payroll, Payment};

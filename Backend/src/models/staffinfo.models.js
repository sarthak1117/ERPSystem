import mongoose from "mongoose";
import { leaveBalanceSchema } from "./leave.models.js";
import { Department, Designation } from "./DepartmentandDesignation.models.js";

const staffSchema = new mongoose.Schema({
    StaffId: {
        type: String,
        required: true,
        unique: true
    },
    Role: {
        type: String,
        required: true,
        enum: ["Admin", "Faculty", "Accountant", "Receptionist", "Super Admin", "Driver", "Manager", "Director", "Librarian", "Technical Head", "Lab Assistant"]
    },
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    FatherName: {
        type: String,
        required: true
    },
    MotherName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    StaffPhoto: {
        type: String,
        default: null
    },
    Gender: {
        type: String,
        required: true
    },
    DateOfBirth: {
        type: Date,
        required: true
    },
    Phone: {
        type: String
    },
    EmergencyContactNumber: {
        type: String
    },
    MaritalStatus: {
        type: String,
        enum: ["Married", "Single", "Widowed", "Divorced"]
    },
    Address: {
        CurrentAddress: {
            type: String
        },
        PermanentAddress: {
            type: String
        }
    },
    Qualification: {
        type: String
    },
    WorkExperience: {
        type: String
    },
    Note: {
        type: String
    },
    ContractType: {
        type: String,
        enum: ['Part-time', "Probation", "Full-time", "Intern"]
    },
    WorkShift: {
        type: String
    },
    EPFNo: {
        type: String
    },
    Basic: {
        type: Number
    },
    AccountTitle: {
        type: String
    },
    BankAccountNumber: {
        type: String
    },
    BankName: {
        type: String
    },
    IFSCCode: {
        type: String
    },
    BankBranchName: {
        type: String
    },
    Location: {
        type: String
    },
    Resume: {
        type: String,
        default: null
    },
    JoiningLetter: {
        type: String,
        default: null
    },
    OtherDocuments: [{
        type: String,
        default: null
    }],
    departments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true
    }],
    designations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Designation",
        required: true
    }],
    leaveBalances: [leaveBalanceSchema],
    leaveBalance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LeaveBalance'
      },  
    LibraryCardNo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LibraryCard"
    }
});

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;


const staffSchema = new mongoose.Schema({
    StaffId: {
      type: String,
      required: true,
      unique: true,
    },
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
      type: String,
      required: true,
    },
    FatherName: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      enum: ["admin", "sub-admin", "faculty", "librarian", "humanResource","accountant"],
    },
    MotherName: {
      type: String,
      required: true,
    },
  
    Email: { type: String, required: true },
    StaffPhoto: {
      type: String,
      default: null,
    },
    Gender: {
      type: String,
      required: true,
    },
    DateOfBirth: {
      type: Date,
      required: true,
    },
    Phone: {
      type: String,
    },
    EmergencyContactNumber: {
      type: String,
    },
    MaritalStatus: {
      type: String,
      enum: ["Married", "Single", "Widowed", "Divorced"],
    },
    Address: {
      
      CurrentAddress: {
        type: String,
      },
      PermanentAddress: {
        type: String,
      },
    },
    Qualification: {
      type: String,
    },
    WorkExperience: {
      type: String,
    },
    Note: {
      type: String,
    },
    ContractType: {
      type: String,
      enum: ["Part-time", "Probation", "Full-time", "Intern"],
    },
    WorkShift: {
      type: String,
    },
    
    EPFNo: {
      type: String,
    },
    Basic: {
      type: Number,
    },
    AccountTitle: {
      type: String,
    },
    BankAccountNumber: {
      type: String,
    },
    BankName: {
      type: String,
    },
    IFSCCode: {
      type: String,
    },
    BankBranchName: {
      type: String,
    },
    Location: {
      type: String,
    },
  
    Resume: {
      type: String,
      default: null,
      // You may add other validation rules if needed
    },
    JoiningLetter: {
      type: String,
      default: null,
      // You may add other validation rules if needed
    },
    OtherDocuments: [
      {
        type: String,
        default: null,
        // You may add other validation rules if needed
      },
    ],
  
    Department: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true,
      },
    
  
    Designation: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Designation",
        required: true,
      },
    
  
      leaveBalance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LeaveBalance'
      },
  
      LibraryCardNo: {
      type: String,
      ref: "LibraryNumber",
       },
  
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  });
  
  // staffSchema.pre("save", async function (next) {
  //   if (this.isNew || this.isModified("Email")) {
  //     const user = await User.findOneAndUpdate(
  //       { email: this.Email },
  //       {
  //         username: this.Email,
  //         fullName: ${this.FirstName} ${this.LastName},
  //         roles: [this.Role.toLowerCase()],
  //       },
  //       { upsert: true, new: true }
  //     );
  //     this.user = user._id;
  //   }
  //   next();
  // });
  
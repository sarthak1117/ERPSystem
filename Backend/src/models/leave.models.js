import mongoose, { Schema } from "mongoose";


const leaveTypeSchema = new Schema({
    
    Name: {
      type: String,
      required: true,
      
    },
  }, { timestamps: true });
  
  
  
  export const LeaveType = mongoose.model("LeaveType", leaveTypeSchema);


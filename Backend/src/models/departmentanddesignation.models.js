import mongoose, { Schema } from "mongoose";


const departmentSchema = new Schema({
    
    Name: {
      type: String,
      required: true,
      
    },
  }, { timestamps: true });
  
  
  
  export const Department = mongoose.model("Department", departmentSchema);


  
const designationSchema = new Schema({
    
    Name: {
      type: String,
      required: true,
      
    },
  }, { timestamps: true });
  
  
  
  export const Designation = mongoose.model("Designation", designationSchema);
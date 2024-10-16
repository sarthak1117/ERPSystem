import mongoose, { Schema } from "mongoose";


const academicSchema = new Schema({
    
    subjectName: {
      type: String,
      required: true,
      
    },
    subjectCode: {
      type: String,
      unique: true,
      required: true,
    },
    subjectType: {
      type: String,
      required: true,
      enum: ["Theory", "Practical"]
    },

    subjectGroup: {
        type: String,
     
      },
    
  });
  
  
  
  export const Subject = mongoose.model("Subject", academicSchema);
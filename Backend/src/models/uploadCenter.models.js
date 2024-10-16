import mongoose, { Schema } from "mongoose";
import {Course} from "./studentInfo.models.js"
import { Batch } from "./studentInfo.models.js";



const uploadCenterSchema = new Schema({
    
    ContentTitle: {
      type: String,
      required: true,
      
    },
    ContentType: {
      type: String,
      required: true,
      enum:["assignment", "Study materials", "Syllabus" , "other downloads"]
    },
    UploadDate: {
      type: Date
    }, 

    Description: {
        type: String,
    },
    ContentFile:{
        type:String
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Course,
    },

    batch: {
        type : Schema.Types.ObjectId,
        ref: Batch,
    },

    availableToEveryone: {
        type: Boolean,
        default: false,
      },
      allBatches: {
        type: Boolean,
        default: false,
      },
    

  });
  
  export const UploadCenter = mongoose.model("UploadCenter", uploadCenterSchema); 
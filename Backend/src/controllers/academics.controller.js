import { asyncHandler } from "../utils/asyncHandler.js";
import { StudentInfo, Batch, Course } from "../models/studentInfo.models.js";
import csv from "fast-csv";
import path from "path";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";
import xlsx from "xlsx";
import { fileURLToPath } from "url";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/";




const addCourse = asyncHandler(async (req, res) => {
    console.log("Incoming Request:", req.body);
  
    const { name, duration, admissionCharge, courseCharge, batchIds } = req.body;
  
    if (!name || !duration || !admissionCharge || !courseCharge) {
      console.log("Validation Failed");
  
      throw new ApiError("All fields are required", 400);
    }
  
    // Validate that batchIds is an array
    if (!Array.isArray(batchIds)) {
      throw new ApiError("batchIds must be an array", 400);
    }
  
    // Verify that the batches exist
    const batches = await Batch.find({ _id: { $in: batchIds } });
    if (batches.length !== batchIds.length) {
      throw new ApiError("Some batches were not found", 404);
    }
  
    // Create new course with batch references
    const newCourse = new Course({
      name,
      duration,
      admissionCharge,
      courseCharge,
      batches: batchIds
    });
  
    // Save the course
    const savedCourse = await newCourse.save();
  
    return res.status(201).json(
      new ApiResponse(
        200,
        {
          savedCourse,
        },
        "data saved successfully"
      )
    );
  });    
  
  
  const getCourses = async (req, res) =>{
      try{
        const courses = await Course.find().populate('batches', 'name'); 
  
        
        const modifiedCourses = courses.map(course => {
          const batches = course.batches.map(batch => batch.name); 
          return {
            ...course.toObject(), 
            batches: batches
          };
        });
        
        
        res.status(200).json({
          success:true,
          message: "Course fetched successfully", 
          data: modifiedCourses,     
        })
      }
      catch{
        res.status(500).json({
          success: false,
          message: "Failed to fetch Course",
          error: error.message
        });
      }
    }
    
    const getCourses = asyncHandler(async (req, res) => {
    try {
      const courses = await Course.find().populate('batches', 'name');
  
      const modifiedCourses = await Promise.all(
        courses.map(async course => {
          const batches = await Batch.find({ course: course._id }).select('name');
          return {
            ...course.toObject(),
            batches: batches.map(batch => batch.name)
          };
        })
      );
  
      res.status(200).json({
        success: true,
        message: "Courses fetched successfully",
        data: modifiedCourses
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch courses",
        error: error.message
      });
    }
  });

  const addBatch = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        throw new ApiError('Batch name is required', 400);
    }

    // Create new batch
    const newBatch = new Batch({ name });

    // Save the batch
    const savedBatch = await newBatch.save();
    res.status(201).json(savedBatch);
});

  const getBatches = async (req, res) => {
    try {
      const batches = await Batch.find();
      res.status(200).json({
        success: true,
        message: "Batches fetched successfully",
        data: batches,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch batches",
        error: error.message,
      });
    }
  };
  
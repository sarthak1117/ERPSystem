import { asyncHandler } from "../utils/asyncHandler.js";
import { UploadCenter } from "../models/uploadCenter.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Course, Batch } from "../models/studentInfo.models.js"; // Import Course and Batch models

const uploadMaterial = asyncHandler(async (req, res) => {
  console.log("Received uploadMaterial request...");

  const {
    ContentTitle,
    ContentType,
    Description,
    batchId,
    courseId,
    UploadDate,
    availableToEveryone
  } = req.body;

  console.log("Request body:", req.body);

  if (!ContentTitle || !ContentType || (!availableToEveryone && (!courseId || !batchId))) {
    console.log("Missing required fields:", ContentTitle, ContentType, courseId, batchId);
    throw new ApiError("ContentTitle, ContentType, courseId, and batchId are required", 400);
  }

  const courseExists = await Course.findById(courseId);
  if (!courseExists) {
    console.log("Course not found:", courseId);
    throw new ApiError("Course not found", 404);
  }

  let batch = null;
  if (!availableToEveryone) {
    if (!batchId) {
      console.log("Batch ID is required if not selecting all batches");
      throw new ApiError("Batch ID is required if not selecting all batches", 400);
    }
    batch = await Batch.findOne({ course: courseId, _id: batchId });
    if (!batch) {
      console.log("Batch not found in the specified course:", batchId, courseId);
      throw new ApiError("Batch not found in the specified course", 404);
    }
  }

  // Handle file upload logic if needed
  let contentFileLocalPath;
  if (req.file) {
    contentFileLocalPath = req.file.path;
    console.log("Uploaded file path:", contentFileLocalPath);
  }

  // Perform file upload to cloud storage if needed
  const contentFile = contentFileLocalPath ? await uploadOnCloudinary(contentFileLocalPath) : null;

  // Create new UploadCenter document
  const newMaterial = new UploadCenter({
    ContentTitle,
    ContentType,
    Description,
    ContentFile: contentFile?.url || "", // Assuming uploadOnCloudinary returns an object with a `url` property
    batch: availableToEveryone ? null : batchId,
    course: courseId,
    availableToEveryone: availableToEveryone || false,
    UploadDate: Date.now(),
  });

  // Save the new UploadCenter document
  await newMaterial.save();

  // Send response back to client
  res.status(201).json({
    success: true,
    data: newMaterial,
    message: "Study material uploaded successfully"
  });
});

export { uploadMaterial };


import asyncHandler from 'express-async-handler';
import UploadCenter from '../models/uploadCenter.model.js';
import { uploadOnCloudinary } from '../utils/uploadOnCloudinary.js';

const uploadMaterial = asyncHandler(async (req, res) => {
  console.log("Received uploadMaterial request...");
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);

  const {
    ContentTitle,
    ContentType,
    Description,
    batchId,
    courseId,
    availableToEveryone
  } = req.body;

  const isAvailableToEveryone = availableToEveryone === 'true';

  if (!ContentTitle || !ContentType || (!isAvailableToEveryone && (!courseId || !batchId))) {
    return res.status(400).json({ message: "ContentTitle, ContentType, courseId, and batchId are required" });
  }

  if (!isAvailableToEveryone) {
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!batchId) {
      return res.status(400).json({ message: "Batch ID is required if not selecting all batches" });
    }

    const batch = await Batch.findOne({ course: courseId, _id: batchId });
    if (!batch) {
      return res.status(404).json({ message: "Batch not found in the specified course" });
    }
  }

  let contentFileUrl = '';
  if (req.file) {
    const contentFileLocalPath = req.file.path;
    try {
      const uploadedFile = await uploadOnCloudinary(contentFileLocalPath);
      contentFileUrl = uploadedFile?.url || '';
    } catch (error) {
      return res.status(500).json({ message: "Error uploading file to cloud storage" });
    }
  }

  const newMaterial = new UploadCenter({
    ContentTitle,
    ContentType,
    Description,
    ContentFile: contentFileUrl,
    batch: isAvailableToEveryone ? null : batchId,
    course: isAvailableToEveryone ? null : courseId,
    availableToEveryone: isAvailableToEveryone,
    UploadDate: Date.now(),
  });

  await newMaterial.save();

  res.status(201).json({
    success: true,
    data: newMaterial,
    message: "Study material uploaded successfully"
  });
});

export { uploadMaterial };

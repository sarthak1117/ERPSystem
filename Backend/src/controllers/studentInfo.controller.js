import { asyncHandler } from "../utils/asyncHandler.js";
import { StudentInfo, Batch, Course } from "../models/studentInfo.models.js";
import csv from "fast-csv";
import path from "path";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";
import xlsx from "xlsx";

import { fileURLToPath } from "url";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);


const generateRandomPassword = () => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  console.log(password)
  return password;
};
const createStudent = asyncHandler(async (req, res) => {
  console.log(req.body);
  const {
    AdmissionNo,
    RollNo,
    FirstName,
    LastName,
    Gender,
    DateOfBirth,
    Category,
    MobileNumber,
    Email,
    AdmissionDate,
    StudentHouse,
    AsOnDate,
    FatherName,
    GuardianRelation,
    GuardianOccupation,
    GuardianAddress,
    CurrentAddress,
    PermanentAddress,
    Notes,
    batchId,
    courseId,
    DisableStudent,
    DisableReason,
  } = req.body;

  // Validate the AdmissionNo
  if (!AdmissionNo) {
    return res.status(400).json({
      success: false,
      message: "AdmissionNo is required",
    });
  }

  // Validate Course ID
  if (!courseId) {
    throw new ApiError("Course ID is required", 400);
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError("Course not found", 404);
  }

  // Validate Batch ID
  if (!batchId) {
    throw new ApiError("Batch ID is required", 400);
  }

  const batch = await Batch.findOne({ course: courseId, _id: batchId });
  if (!batch) {
    throw new ApiError("Batch not found in the specified course", 404);
  }

  // Check for existing student by AdmissionNo
  const existingStudent = await StudentInfo.findOne({ AdmissionNo });
  if (existingStudent) {
    return res.status(400).json({
      success: false,
      message: "Student with this AdmissionNo already exists",
    });
  }

  // Check for existing student by RollNo if it's unique
  const existingRollNoStudent = await StudentInfo.findOne({ RollNo });
  if (existingRollNoStudent) {
    return res.status(400).json({
      success: false,
      message: "Student with this RollNo already exists",
    });
  }

  // Validate DisableStudent and DisableReason
  if (DisableStudent && !DisableReason) {
    throw new ApiError("Disable reason is required when student is disabled", 400);
  }

  // Handle file uploads
  let studentPhotoLocalPath = '';
  let fatherPhotoLocalPath = '';
  let documentLocalPath = '';
  let otherDocumentLocalPath = '';

  if (req.files) {
    if (Array.isArray(req.files.StudentPhoto) && req.files.StudentPhoto.length > 0) {
      studentPhotoLocalPath = req.files.StudentPhoto[0].path;
    }

    if (Array.isArray(req.files.FatherPhoto) && req.files.FatherPhoto.length > 0) {
      fatherPhotoLocalPath = req.files.FatherPhoto[0].path;
    }

    if (Array.isArray(req.files.Document) && req.files.Document.length > 0) {
      documentLocalPath = req.files.Document[0].path;
    }

    if (Array.isArray(req.files.OtherDocument) && req.files.OtherDocument.length > 0) {
      otherDocumentLocalPath = req.files.OtherDocument[0].path;
    }
  }

  // Upload files to Cloudinary
  const StudentPhoto = studentPhotoLocalPath
    ? await uploadOnCloudinary(studentPhotoLocalPath)
    : null;
  const FatherPhoto = fatherPhotoLocalPath
    ? await uploadOnCloudinary(fatherPhotoLocalPath)
    : null;
  const Document = documentLocalPath
    ? await uploadOnCloudinary(documentLocalPath)
    : null;
  const OtherDocument = otherDocumentLocalPath
    ? await uploadOnCloudinary(otherDocumentLocalPath)
    : null;

    

  // Create new student record
  const newStudent = new StudentInfo({
    AdmissionNo,
    RollNo,
    FirstName,
    LastName,
    Gender,
    Email,
    DateOfBirth,
    Category,
    MobileNumber,
    batch: batchId,
    course: courseId,
    DisableStudent,
    DisableReason,
    AdmissionDate,
    StudentPhoto: StudentPhoto?.url || "",
    FatherPhoto: FatherPhoto?.url || "",
    StudentHouse,
    AsOnDate,
    FatherName,
    GuardianRelation,
    GuardianOccupation,
    GuardianAddress,
    Address: { CurrentAddress, PermanentAddress },
    Notes,
    Document: Document?.url || "",
    OtherDocument: OtherDocument?.url || ""
  });

  try {
    // Save student record
    const savedStudent = await newStudent.save();

    // Create user account for the student
    const user = new User({
      fullName: ${savedStudent.FirstName} ${savedStudent.LastName},
      email: savedStudent.Email,
      username: savedStudent.RollNo.toString(), // Assuming RollNo is a number
      password: generateRandomPassword(),
      roles: savedStudent.roles,
      studentInfos: savedStudent._id,
    });

    const savedUser = await user.save();

    // Link student with user account
    savedStudent.user = savedUser._id;
    await savedStudent.save();

    res.status(201).json({
      success: true,
      message: "Student saved successfully",
      data: savedStudent,
    });
  } catch (error) {
    console.error("Error during student save:", error); // Log the error for debugging
    if (error.name === "MongoError" && error.code === 11000) {
      const duplicatedField = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: ${duplicatedField} already exists,
      });
    }
    res.status(500).json({
      success: false,
      message: "An error occurred while saving the student",
      error: error.message,
    });
  }
});





const getStudentsByCourseAndBatch = asyncHandler(async (req, res) => {
  try {
    const { courseId, batchId, fields } = req.query;
    const selectedFields = fields ? fields.split(',').join(' ') : '';

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Find the batch within the course
    const batch = await Batch.findOne({ course: courseId, _id: batchId });
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found in the specified course',
      });
    }

    // Find students in the batch
    const students = await StudentInfo.find({ batch: batchId })
      .select(selectedFields)
      .populate('batch');

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

 
// const studentDetails = asyncHandler(async (req, res) => {
//   const { courseId, batchId } = req.query;

//   if (!courseId || !batchId) {
//     return res.status(400).json({
//       success: false,
//       message: "Course ID and Batch ID are required",
//     });
//   }

//   try {
//     // Find the batches associated with the given courseId
//     const batch = await Batch.findOne({ _id: batchId, course: courseId });

//     if (!batch) {
//       return res.status(404).json({
//         success: false,
//         message: "No batch found for the given course and batch ID",
//       });
//     }

//     // Find students associated with the batchId
//     const students = await StudentInfo.find({ batch: batchId })
//       .select('admissionNumber studentName course fatherName dateOfBirth gender category mobileNumber') // Select only the required fields
//       .populate({
//         path: 'batch',
//         select: 'course' // Only populate the course field of the batch
//       });

//     if (!students.length) {
//       return res.status(404).json({
//         success: false,
//         message: "No students found for the given course and batch",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Students fetched successfully",
//       data: students,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch students",
//       error: error.message,
//     });
//   }
// });


const importStudents = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Please upload a file!");
    }


    const { courseId, batchId } = req.body;

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    // Check if the batch exists within the course
    const batch = await Batch.findOne({ course: courseId, _id: batchId });
    if (!batch) {
      throw new ApiError("Batch not found in the specified course", 404);
    }

    const filePath = path.join(__dirname, "../../public/temp", req.file.filename);
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    let students = [];

    if (fileExtension === ".csv") {
      // Process CSV file
      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => {
          throw new Error(error.message);
        })
        .on("data", (data) => {
          students.push(data);
        })
        .on("end", async () => {
          try {
            // Collect AdmissionNos and Emails
            const admissionNos = students.map(s => s.AdmissionNo);
            const emails = students.map(s => s.Email);

            // Check for duplicates in the database
            const existingStudents = await StudentInfo.find({
              $or: [
                { AdmissionNo: { $in: admissionNos } },
                { Email: { $in: emails } }
              ]
            });

            if (existingStudents.length > 0) {
              const duplicates = existingStudents.map(s => AdmissionNo: ${s.AdmissionNo}, Email: ${s.Email}).join(', ');
              throw new Error(Duplicate entries found: ${duplicates});
            }

            const savedStudents = await StudentInfo.insertMany(students);

            const users = savedStudents.map(student => ({
              fullName: ${student.FirstName} ${student.LastName},
              email: student.Email,
              username: student.RollNo,
              password: generateRandomPassword(), // Implement your password generation logic
              roles: student.roles,
              studentInfos: student._id,
            }));

            await User.insertMany(users);

            fs.unlinkSync(filePath); // Remove the temporary file
            res.status(200).send({
              message: "Uploaded the file successfully: " + req.file.originalname,
            });
          } catch (error) {
            fs.unlinkSync(filePath); // Remove the temporary file on error
            res.status(500).send({
              message: "Fail to import data into database!",
              error: error.message,
            });
          }
        });
    } else if (fileExtension === ".xlsx") {
      // Process XLSX file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      students = xlsx.utils.sheet_to_json(sheet);

      try {
        // Collect AdmissionNos and Emails
        const admissionNos = students.map(s => s.AdmissionNo);
        const emails = students.map(s => s.Email);

        // Check for duplicates in the database
        const existingStudents = await StudentInfo.find({
          $or: [
            { AdmissionNo: { $in: admissionNos } },
            { Email: { $in: emails } }
          ]
        });

        if (existingStudents.length > 0) {
          const duplicates = existingStudents.map(s => AdmissionNo: ${s.AdmissionNo}, Email: ${s.Email}).join(', ');
          throw new Error(Duplicate entries found: ${duplicates});
        }

        const savedStudents = await StudentInfo.insertMany(students);

        const users = savedStudents.map(student => ({
          fullName: ${student.FirstName} ${student.LastName},
          email: student.Email,
          username: student.RollNo,
          password: generateRandomPassword(), // Implement your password generation logic
          roles: ['student'],
          studentInfos: student._id,
        }));

        await User.insertMany(users);


        fs.unlinkSync(filePath); // Remove the temporary file
        res.status(200).send({
          message: "Uploaded the file successfully: " + req.file.originalname,
        });
      } catch (error) {
        fs.unlinkSync(filePath); // Remove the temporary file on error
        res.status (500).send({
          message: "Fail to import data into database!",
          error: error.message,
        });
      }
    } else {
      fs.unlinkSync(filePath); // Remove the temporary file for unsupported file types
      res.status(400).send({
        message: "Unsupported file type. Only CSV and Excel files are allowed.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
      error: error.message,
    });
  }
})

const bulkDelete = asyncHandler(async (req, res) => {
  const { courseId, batchId, studentId } = req.body;

  if (!courseId) {
    throw new ApiError("Course ID not found", 400);
  }

  // Delete a single student
  if (studentId) {
    const student = await StudentInfo.findOne({ _id: studentId, course: courseId, batch: batchId });
    if (!student) {
      throw new ApiError("Student not found or does not belong to the specified course and batch", 404);
    }

    // Delete the student
    await StudentInfo.findByIdAndDelete(studentId);

    return res.status(200).json({ message: "Student deleted successfully" });
  }

  // Delete students based on course only
  if (courseId && !batchId) {
    const course = await Course.findById(courseId);

    if (!course) {
      throw new ApiError("Course not found", 404);
    }

    const batches = await Batch.find({ courseId: courseId });
    const batchIds = batches.map((batch) => batch._id);

    // Delete students associated with the course
    await StudentInfo.deleteMany({ course: courseId });

    // Delete students associated with the batches
    await StudentInfo.deleteMany({ batch: { $in: batchIds } });

    // Delete the batches
    await Batch.deleteMany({ courseId: courseId });

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      message: "Course and associated batches and students deleted successfully",
    });
  }

  // Delete students based on course and batch
  if (courseId && batchId) {
    const batch = await Batch.findOne({ _id: batchId, courseId: courseId });
    if (!batch) {
      throw new ApiError("Batch not found or does not belong to the specified course", 404);
    }

    // Delete all students associated with this batch
    await StudentInfo.deleteMany({ batch: batchId });

    // Delete the batch
    await Batch.findByIdAndDelete(batchId);

    return res.status(200).json({ message: "Batch and associated students deleted successfully" });
  }

  throw new ApiError("Invalid request", 400);
});


const validateCourseAndBatch = async (courseId, batchId) => {
  if (!courseId) {
    throw new ApiError("Course ID is required", 400);
  }
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError("Course not found", 404);
  }
  if (!batchId) {
    throw new ApiError("Batch ID is required", 400);
  }
  const batch = await Batch.findOne({ course: courseId, _id: batchId });
  if (!batch) {
    throw new ApiError("Batch not found in the specified course", 404);
  }
};


export { createStudent, importStudents, bulkDelete, getStudentsByCourseAndBatch };
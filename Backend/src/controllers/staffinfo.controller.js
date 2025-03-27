import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
// import ApiResponse from "../utils/ApiResponse.js";
import Staff from "../models/staffinfo.models.js";
import { Department, Designation } from "../models/departmentanddesignation.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";
import { generateRandomPassword } from "./studentInfo.controller.js"



const addStaff = asyncHandler(async (req, res) => {
    const {
        StaffId,
        Role,
        Designation: designationId,
        Department: departmentId,
        FirstName,
        LastName,
        FatherName,
        MotherName,
        Email,
        Gender,
        DateOfBirth,
        Phone,
        EmergencyContactNumber,
        MaritalStatus,
        Address,
        Qualification,
        WorkExperience,
        Note,
        ContractType,
        WorkShift,
        EPFNo,
        Basic,
        AccountTitle,
        BankAccountNumber,
        BankName,
        IFSCCode,
        BankBranchName,
        Location,
    } = req.body;

    // Validate Department ID
    if (!departmentId) throw new ApiError(400, "Department ID is required");
    const department = await Department.findById(departmentId);
    if (!department) throw new ApiError(404, "Department not found");

    // Validate Designation ID
    if (!designationId) throw new ApiError(400, "Designation ID is required");
    const designation = await Designation.findById(designationId);
    if (!designation) throw new ApiError(404, "Designation not found");

    // Check if StaffId is unique
    const existingStaff = await Staff.findOne({ StaffId });
    if (existingStaff) {
        return res.status(400).json({
            success: false,
            message: "Staff with this Staff ID already exists",
        });
    }

    // Handle file uploads
    let staffPhotoLocalPath, resumeLocalPath, joiningLetterLocalPath, otherDocumentLocalPath;
    if (req.files) {
        if (req.files.staffPhoto?.length > 0) staffPhotoLocalPath = req.files.staffPhoto[0].path;
        if (req.files.resume?.length > 0) resumeLocalPath = req.files.resume[0].path;
        if (req.files.joiningLetter?.length > 0) joiningLetterLocalPath = req.files.joiningLetter[0].path;
        if (req.files.otherDocument?.length > 0) otherDocumentLocalPath = req.files.otherDocument[0].path;
    }

    // Upload files to Cloudinary
    const staffPhoto = staffPhotoLocalPath ? await uploadOnCloudinary(staffPhotoLocalPath) : null;
    const resume = resumeLocalPath ? await uploadOnCloudinary(resumeLocalPath) : null;
    const joiningLetter = joiningLetterLocalPath ? await uploadOnCloudinary(joiningLetterLocalPath) : null;
    const otherDocument = otherDocumentLocalPath ? await uploadOnCloudinary(otherDocumentLocalPath) : null;

    // Create Staff Record
    const newStaff = new Staff({
        StaffId,
        Role,
        Designation: designationId,
        Department: departmentId,
        FirstName,
        LastName,
        FatherName,
        MotherName,
        Email,
        Gender,
        DateOfBirth,
        Phone,
        EmergencyContactNumber,
        MaritalStatus,
        Address,
        Qualification,
        WorkExperience,
        Note,
        StaffPhoto: staffPhoto?.url || "",
        ContractType,
        WorkShift,
        EPFNo,
        Basic,
        AccountTitle,
        BankAccountNumber,
        BankName,
        IFSCCode,
        BankBranchName,
        Location,
        Resume: resume?.url || "",
        JoiningLetter: joiningLetter?.url || "",
        OtherDocuments: otherDocument?.url || "",
    });

    try {
        // Save staff record
        const savedStaff = await newStaff.save();

        // Create user account for staff
        const user = new User({
            fullName: `${savedStaff.FirstName} ${savedStaff.LastName}`,
            email: savedStaff.Email,
            username: savedStaff.StaffId.toString(), // Using StaffId as username
            password: generateRandomPassword(), // Generate a secure random password
            roles: ["staff"], // Assigning a staff role
            staffInfo: savedStaff._id,
        });

        const savedUser = await user.save();

        // Link staff with user account
        savedStaff.user = savedUser._id;
        await savedStaff.save();

        res.status(201).json({
            success: true,
            message: "Staff member added successfully",
            data: savedStaff,
        });
    } catch (error) {
        console.error("Error saving staff:", error);
        if (error.name === "MongoError" && error.code === 11000) {
            const duplicatedField = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `${duplicatedField} already exists`,
            });
        }
        res.status(500).json({
            success: false,
            message: "An error occurred while saving the staff",
            error: error.message,
        });
    }
});


export {addStaff}
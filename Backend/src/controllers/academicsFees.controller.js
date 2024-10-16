const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError'); // Adjust the path as per your project structure
const FeeMaster = require('../models/FeeMaster'); // Adjust the path as per your project structure
const FeeType = require('../models/FeeType'); // Adjust the path as per your project structure
const FeeGroup = require('../models/FeeGroup'); // Adjust the path as per your project structure

const createFeesMaster = asyncHandler(async (req, res) => {
    try {
        const { FeeTypeId, FeeGroupId, Amount, DueDate, FineType, Percentage, FineAmount } = req.body;

        // Validate FeeTypeId
        if (!FeeTypeId) {
            throw new ApiError(400, "Fee Type ID is required");
        }
        const feeType = await FeeType.findById(FeeTypeId);
        if (!feeType) {
            throw new ApiError(404, "Fee Type not found");
        }

        // Validate FeeGroupId
        if (!FeeGroupId) {
            throw new ApiError(400, "Fee Group ID is required");
        }
        const feeGroup = await FeeGroup.findById(FeeGroupId);
        if (!feeGroup) {
            throw new ApiError(404, "Fee Group not found");
        }

        // Check if the FeeType and FeeGroup combination already exists
        const existingFeesMaster = await FeeMaster.findOne({ FeeType: FeeTypeId, FeeGroup: FeeGroupId });
        if (existingFeesMaster) {
            throw new ApiError(400, "A FeesMaster with this Fee Type and Fee Group combination already exists");
        }

        // Validate FineType
        if (!FineType || !["percentage", "Fix Amount"].includes(FineType)) {
            throw new ApiError(400, "Fine Type must be either 'percentage' or 'Fix Amount'");
        }

        // Conditional validation for FineType
        if (FineType === "percentage") {
            if (Percentage == null || Percentage < 0 || Percentage > 100) {
                throw new ApiError(400, "A valid percentage (0-100) is required when Fine Type is 'percentage'");
            }
        } else if (FineType === "Fix Amount") {
            if (FineAmount == null || FineAmount < 0) {
                throw new ApiError(400, "A valid fine amount is required when Fine Type is 'Fix Amount'");
            }
        }

        // Create a new FeesMaster instance
        const newFeesMaster = new FeeMaster({
            FeeType: feeType,
            FeeGroup: feeGroup,
            Amount,
            DueDate,
            FineType,
            Percentage: FineType === "percentage" ? Percentage : undefined,
            FineAmount: FineType === "Fix Amount" ? FineAmount : undefined
        });

        // Save the new FeesMaster to the database
        await newFeesMaster.save();

        // Return a success response
        return res.status(201).json({
            success: true,
            message: 'Fees master created successfully',
            data: newFeesMaster
        });
    } catch (error) {
        console.error('Error creating fees master:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

module.exports = {
    createFeesMaster,
};


const fetchFeesMaster = asyncHandler(async (req, res) => {
    try {
        // You can add query parameters to filter the results if needed
        const { FeeTypeId, FeeGroupId } = req.query;

        // Build the query object
        const query = {};
        if (FeeTypeId) {
            query.FeeType = FeeTypeId;
        }
        if (FeeGroupId) {
            query.FeeGroup = FeeGroupId;
        }

        // Fetch the fees from the database
        const fees = await FeeMaster.find(query).populate('FeeType').populate('FeeGroup');

        // Check if fees exist
        if (!fees || fees.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No fees found',
            });
        }

        // Return a success response with the fetched fees
        return res.status(200).json({
            success: true,
            data: fees,
        });
    } catch (error) {
        console.error('Error fetching fees:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
});

const createFeesGroup = asyncHandler(async (req, res) => {
    try {
        const { FeesGroupType, FeesGroupName, Description, courseId } = req.body;

        // Validate that FeesGroupName and FeesGroupType are provided
        if (!FeesGroupName || !FeesGroupType) {
            return res.status(400).json({
                success: false,
                message: 'FeesGroupName and FeesGroupType are required'
            }); 
        }

        // Validate courseId for "class" type
        if (FeesGroupType === 'Class' && !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required for class type fees group'
            });
        }

        // Create a new FeesGroup instance
        const newFeesGroup = new FeeGroup({
            FeesGroupType,
            FeesGroupName,
            Description,
            ...(FeesGroupType === 'Class' && { course: courseId }) // Only include courseId if type is 'Class'
        });

        // Save the new FeesGroup to the database
        await newFeesGroup.save();

        // Return a success response
        return res.status(200).json({
            success: true,
            message: 'Fees group created successfully',
            data: newFeesGroup
        });
    } catch (error) {
        console.error('Error creating fees group:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});


const createFeesGroup = asyncHandler(async (req, res) => {
    try {
        const { FeesGroupType, FeesGroupName, description, courseId } = req.body;

        // Validate that FeesGroupName and FeesGroupType are provided
        if (!FeesGroupName || !FeesGroupType) {
            return res.status(400).json({
                success: false,
                message: 'FeesGroupName and FeesGroupType are required'
            });
        }

        // Validate courseId for "class" type
        if (FeesGroupType === 'Class' && !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required for class type fees group'
            });
        }

        // Create a new FeesGroup instance
        const newFeesGroup = new FeeGroup({
            FeesGroupType,
            FeesGroupName,
            description,
            ...(FeesGroupType === 'Class' && { courseId }) // Only include courseId if type is 'Class'
        });

        // Save the new FeesGroup to the database
        await newFeesGroup.save();

        // Return a success response
        return res.status(200).json({
            success: true,
            message: 'Fees group created successfully',
            data: newFeesGroup
        });
    } catch (error) {
        console.error('Error creating fees group:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

const getFeesTypes = asyncHandler(async (req, res) => {
    try {
        // Retrieve all fees types from the database
        const feesTypes = await FeeType.find();

        // Check if fees types were found
        if (!feesTypes.length) {
            return res.status(404).json({
                success: false,
                message: 'No fees types found'
            });
        }

        // Return a success response with the fees types
        return res.status(200).json({
            success: true,
            message: 'Fees types fetched successfully',
            data: feesTypes
        });
    } catch (error) {
        console.error('Error fetching fees types:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

const createFeesType = asyncHandler(async (req, res) => {
    try {
        const { FeesTypeName, FeesTypeCode, Description } = req.body;

        // Create a new FeesType instance
        const newFeesType = new FeeType({
            FeesTypeName,
            FeesTypeCode,
            Description
        });

        // Save the new FeesType to the database
        await newFeesType.save();

        // Return a success response
        return res.status(200).json({
            success: true,
            message: 'Fees type created successfully',
            data: newFeesType
        });
    } catch (error) {
        console.error('Error creating fees type:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

const getFeesTypes = asyncHandler(async (req, res) => {
    try {
        // Retrieve all fees types from the database
        const feesTypes = await FeeType.find();

        if (!feesTypes.length) {
            return res.status(404).json({
                success: false,
                message: 'No fees types found'
            });
        }

        // Return a success response with the fees types
        return res.status(200).json({
            success: true,
            message: 'Fees types fetched successfully',
            data: feesTypes
        });
    } catch (error) {
        console.error('Error fetching fees types:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}); 

import { FeeGroup } from "../models/academicFees.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getFeesGroups = asyncHandler(async (req, res) => {
    try {
        // Retrieve all fees groups from the database
        const feesGroups = await FeeGroup.find();

        if (!feesGroups.length) {
            return res.status(404).json({
                success: false,
                message: 'No fees groups found'
            });
        }

        // Return a success response with the fees groups
        return res.status(200).json({
            success: true,
            message: 'Fees groups fetched successfully',
            data: feesGroups
        });
    } catch (error) {
        console.error('Error fetching fees groups:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

export { getFeesGroups };


import { StudentInfo } from "../models/studentInfo.models.js";
import { Fee, FeeGroup, FeeType } from "../models/academicFees.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { nanoid } from 'nanoid'

const createFeePayment = asyncHandler(async (req, res) => {
    try {
        // Extract relevant data from the request body
        const {
            FeesDescription,
            AmountToBePaid,
            Deposited,
            DueDate,
            PaymentDate,
            PaymentMode,
            studentId  // Assuming the studentId is passed in the request body
        } = req.body;

        // Generate a unique FeesId
        const FeesId = generateUniqueFeesId();

        // Calculate Remaining based on AmountToBePaid and Deposited
        const Remaining = AmountToBePaid - Deposited;

        // Determine the status
        let Status;
        if (Remaining === 0) {
            Status = 'Paid';
        } else if (Remaining === AmountToBePaid) {
            Status = 'Pending';
        } else {
            Status = 'Partial';
        }

        // Create a new fee payment
        const newFee = new Fee({
            FeesId,
            FeesDescription,
            AmountToBePaid,
            Deposited,
            Remaining,
            DueDate,
            PaymentDate,
            Status,
            PaymentMode,
            studentId  // Include the studentId in the new fee document
        });

        // Save the fee payment to the database
        await newFee.save();

        return res.status(201).json({
            success: true,
            message: 'Fee payment created successfully',
            data: newFee,
        });
    } catch (error) {
        console.error('Error creating fee payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const getStudentFeeDetails = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    try {
        // Verify that the student exists
        const student = await StudentInfo.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        // Retrieve the fee details for the specific student
        const fees = await Fee.find({ studentId }).populate('studentId', 'firstName lastName', 'admissionNo','rollNo' ,'mobileNumber' ,'course batch',);

        if (!fees.length) {
            return res.status(404).json({
                success: false,
                message: 'No fee details found for this student',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Fee details fetched successfully',
            data: fees,
        });
    } catch (error) {
        console.error('Error fetching fee details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Helper function to generate a unique FeesId (you can customize this)
const generateUniqueFeesId = () => {
    // Generate a unique ID with the first three letters as "FEE"
    const randomPart = nanoid(12); // Generates a random string of length 9

    // Combine with "FEE-" prefix
    const FeesId = FEE-${randomPart};

    return FeesId;
};

const updateFeePayment = asyncHandler(async (req, res) => {
    try {
        const { feeId } = req.params;  // Fee ID from the request parameters
        const { Deposited, Remaining, PaymentDate, PaymentMode } = req.body;  // New payment details

        // Fetch the existing fee payment record
        const existingFee = await Fee.findById(feeId);
        if (!existingFee) {
            return res.status(404).json({
                success: false,
                message: 'Fee payment record not found',
            });
        }

        // Update the payment details
        existingFee.Deposited += Deposited;
        existingFee.PaymentDate = PaymentDate || existingFee.PaymentDate;
        existingFee.PaymentMode = PaymentMode || existingFee.PaymentMode;
        existingFee.Remaining = Remaining; // Update the remaining amount from the request

        // Determine the new status
        let Status;
        if (existingFee.Remaining === 0) {
            Status = 'Paid';
        } else if (existingFee.Remaining === existingFee.AmountToBePaid) {
            Status = 'Pending';
        } else {
            Status = 'Partial';
        }
        existingFee.Status = Status; // Update the status

        // Save the updated fee payment to the database
        await existingFee.save();

        return res.status(200).json({
            success: true,
            message: 'Fee payment updated successfully',
            data: existingFee,
        });
    } catch (error) {
        console.error('Error updating fee payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


const createFeesType = asyncHandler(async (req, res) => {
    try {
        const { FeesTypeName, FeesTypeCode, Description } = req.body;

        // Create a new FeesType instance
        const newFeesType = new FeeType({
            FeesTypeName,
            FeesTypeCode,
            Description
        });

        // Save the new FeesType to the database
        await newFeesType.save();

        // Return a success response
        return res.status(200).json({
            success: true,
            message: 'Fees type created successfully',
            data: newFeesType
        });
    } catch (error) {
        console.error('Error creating fees type:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});


const createFeesGroup = asyncHandler(async (req, res) => {
    try {
        const { FeesGroupType, FeesGroupName, description, courseId } = req.body;

        if (FeesGroupType === 'class' && !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required for class type fees group'
            });
        }

        // Create a new FeesGroup instance based on the type
        
        const newFeesGroup = new FeeGroup({
            FeesGroupType,
            FeesGroupName,
            description,
            ...(FeesGroupType === 'class' && { courseId }) // Only include courseId if type is 'class'
        });

        // Save the new FeesGroup to the database
        await newFeesGroup.save();

        // Return a success response
        return res.status(200).json({
            success: true,
            message: 'Fees group created successfully',
            data: newFeesGroup
        });
    } catch (error) {
        console.error('Error creating fees group:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});



const createFeesMaster = asyncHandler(async (req, res) => {
    try {
        const { FeesTypeNameId, FeesGroupNameId, AmountToBePaid, DueDate } = req.body;

        // Create a new FeesMaster instance
        const newFeesMaster = new FeesMaster({
            FeesTypeName: FeesTypeNameId,
            FeesGroupName: FeesGroupNameId,
            AmountToBePaid,
            DueDate
        });

        // Save the new FeesMaster to the database
        await newFeesMaster.save();

        // Return a success response
        return res.status(201).json({
            success: true,
            message: 'Fees master created successfully',
            data: newFeesMaster
        });
    } catch (error) {
        console.error('Error creating fees master:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});





export  {getStudentFeeDetails, createFeePayment, updateFeePayment, createFeesType ,  createFeesGroup, createFeesMaster };


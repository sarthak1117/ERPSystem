import asyncHandler from "../middleware/asyncHandler";
import { Designation } from "../models/designationModel";
import { ApiResponse, ApiError } from "../utils/apiResponses";
import { Department } from "../models/departmentModel";


// Create a new designation
const createDesignation = asyncHandler(async (req, res, next) => {
  const { Name } = req.body;
  try {
    const newDesignation = await Designation.create({ Name });
    res.status(201).json(new ApiResponse(201, newDesignation, "Designation created successfully"));
  } catch (error) {
    next(new ApiError(500, "Error creating designation", [error.message]));
  }
});

// Get all designations
const getDesignations = asyncHandler(async (req, res, next) => {
  try {
    const designations = await Designation.find();
    res.status(200).json(new ApiResponse(200, designations, "Designations fetched successfully"));
  } catch (error) {
    next(new ApiError(500, "Error fetching designations", [error.message]));
  }
});

// Get a single designation by ID
const getDesignationById = asyncHandler(async (req, res, next) => {
  try {
    const designation = await Designation.findById(req.params.id);
    if (!designation) {
      return next(new ApiError(404, "Designation not found"));
    }
    res.status(200).json(new ApiResponse(200, designation, "Designation fetched successfully"));
  } catch (error) {
    next(new ApiError(500, "Error fetching designation", [error.message]));
  }
});

// Update a designation by ID
const updateDesignation = asyncHandler(async (req, res, next) => {
  const { Name } = req.body;
  try {
    const updatedDesignation = await Designation.findByIdAndUpdate(
      req.params.id,
      { Name },
      { new: true, runValidators: true }
    );
    if (!updatedDesignation) {
      return next(new ApiError(404, "Designation not found"));
    }
    res.status(200).json(new ApiResponse(200, updatedDesignation, "Designation updated successfully"));
  } catch (error) {
    next(new ApiError(500, "Error updating designation", [error.message]));
  }
});

// Delete a designation by ID
const deleteDesignation = asyncHandler(async (req, res, next) => {
  try {
    const deletedDesignation = await Designation.findByIdAndDelete(req.params.id);
    if (!deletedDesignation) {
      return next(new ApiError(404, "Designation not found"));
    }
    res.status(200).json(new ApiResponse(200, deletedDesignation, "Designation deleted successfully"));
  } catch (error) {
    next(new ApiError(500, "Error deleting designation", [error.message]));
  }
});



// Create a new department
const createDepartment = asyncHandler(async (req, res, next) => {
  const { Name } = req.body;
  try {
    const newDepartment = await Department.create({ Name });
    res.status(201).json(new ApiResponse(201, newDepartment, "Department created successfully"));
  } catch (error) {
    next(new ApiError(500, "Error creating department", [error.message]));
  }
});

// Get all departments
const getDepartments = asyncHandler(async (req, res, next) => {
  try {
    const departments = await Department.find();
    res.status(200).json(new ApiResponse(200, departments, "Departments fetched successfully"));
  } catch (error) {
    next(new ApiError(500, "Error fetching departments", [error.message]));
  }
});

// Get a single department by ID
const getDepartmentById = asyncHandler(async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return next(new ApiError(404, "Department not found"));
    }
    res.status(200).json(new ApiResponse(200, department, "Department fetched successfully"));
  } catch (error) {
    next(new ApiError(500, "Error fetching department", [error.message]));
  }
});

// Update a department by ID
const updateDepartment = asyncHandler(async (req, res, next) => {
  const { Name } = req.body;
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { Name },
      { new: true, runValidators: true }
    );
    if (!updatedDepartment) {
      return next(new ApiError(404, "Department not found"));
    }
    res.status(200).json(new ApiResponse(200, updatedDepartment, "Department updated successfully"));
  } catch (error) {
    next(new ApiError(500, "Error updating department", [error.message]));
  }
});

// Delete a department by ID
const deleteDepartment = asyncHandler(async (req, res, next) => {
  try {
    const deletedDepartment = await Department.findByIdAndDelete(req.params.id);
    if (!deletedDepartment) {
      return next(new ApiError(404, "Department not found"));
    }
    res.status(200).json(new ApiResponse(200, deletedDepartment, "Department deleted successfully"));
  } catch (error) {
    next(new ApiError(500, "Error deleting department", [error.message]));
  }
});




export { createDesignation, getDesignations, getDesignationById, updateDesignation, deleteDesignation, createDepartment, getDepartments, getDepartmentById, updateDepartment, deleteDepartment };

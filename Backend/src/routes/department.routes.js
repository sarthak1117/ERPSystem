import express from 'express';
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentanddesignation.controller.js';

const router = express.Router();

// Routes for Departments
router.route('/')
  .get(getDepartments)       // Get all departments
  .post(createDepartment);   // Create a new department

router.route('/:id')
  .get(getDepartmentById)    // Get a single department by ID
  .put(updateDepartment)     // Update a department by ID
  .delete(deleteDepartment); // Delete a department by ID

export default router;

import express from 'express';
import {
  createDesignation,
  getDesignations,
  getDesignationById,
  updateDesignation,
  deleteDesignation,
} from '../controllers/departmentanddesignation.controller.js';

const router = express.Router();

// Routes for Designations
router.route('/')
  .get(getDesignations)       // Get all designations
  .post(createDesignation);   // Create a new designation

router.route('/:id')
  .get(getDesignationById)    // Get a single designation by ID
  .put(updateDesignation)     // Update a designation by ID
  .delete(deleteDesignation); // Delete a designation by ID

export default router;

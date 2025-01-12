import express from 'express';
import {
  createIncomeHead,
  getIncomeHeads,
  updateIncomeHead,
  deleteIncomeHead,
  createIncome,
  getIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
} from '../controllers/income.controller.js';
import  { upload } from '../middlewears/multer.middlewear.js'; // Ensure you have the correct path to your middleware

const router = express.Router();

// Income Heads Routes
router
  .route('/heads')
  .get(getIncomeHeads) // Get all Income Heads
  .post(createIncomeHead); // Create an Income Head

router
  .route('/heads/:id')
  .put(updateIncomeHead) // Update an Income Head by ID
  .delete(deleteIncomeHead); // Delete an Income Head by ID

// Income Routes
router
  .route('/')
  .get(getIncomes) // Get all Incomes
  .post(upload.single("Document"), createIncome); // Create an Income with optional document upload

router
  .route('/:id')
  .get(getIncomeById) // Get an Income by ID
  .put(upload.single("Document"), updateIncome) // Update an Income by ID with optional document upload
  .delete(deleteIncome); // Delete an Income by ID

export default router;

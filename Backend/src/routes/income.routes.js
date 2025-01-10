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

const router = express.Router();

// Income Heads Routes
router.route('/heads').get(getIncomeHeads).post(createIncomeHead);
router
  .route('/heads/:id')
  .put(updateIncomeHead)
  .delete(deleteIncomeHead);

// Income Routes
router.route('/').get(getIncomes).post(createIncome);
router
  .route('/:id')
  .get(getIncomeById)
  .put(updateIncome)
  .delete(deleteIncome);

export default router;

import express from 'express';
import { getFeesTypes, getFeesGroups } from '../controllers/feesController.js';

const router = express.Router();

// Route to get all fees types
router.get('/fees-types', getFeesTypes);

// Route to get all fees groups
router.get('/fees-groups', getFeesGroups);

export default router;
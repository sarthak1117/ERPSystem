const express = require('express');
const { createPayroll } = require('../controllers/payrollController');

const router = express.Router();

router.post('/payroll', createPayroll);

module.exports = router;

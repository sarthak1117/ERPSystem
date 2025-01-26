import express from "express";
import { createPayroll, getPayroll } from "../controllers/payroll.controller.js";

  
const router = express.Router();

router.post("/createpayroll", createPayroll)


router.get('/getPayroll', getPayroll);
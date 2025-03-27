import express from "express";
import { addStaff } from "../controllers/staffinfo.controller.js";

const router = express.Router();

// Route to add a new staff member
router.post("/newStaff", addStaff);

export default router;
// uploadCenter.routes.js
import express from "express";
import { uploadMaterial } from "../controllers/uploadCenter.controller.js";
import { uploadPDF } from "../middlewares/multer.middleware.js"; // Middleware for handling file uploads

const router = express.Router();

router.post("/uploadMaterial", uploadPDF.single("ContentFile"), uploadMaterial);

export default router;

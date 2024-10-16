

import express from "express";
import { issueBook, importBooks, addLibraryCardNumberStudent, addLibraryCardNumberStaff, addBook, getBooks } from "../controllers/library.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/addLibraryCardNumberStudent", addLibraryCardNumberStudent)
router.post("/addLibraryCardNumberStaff", addLibraryCardNumberStaff)
router.post("/addBook", addBook)
router.post("/issueBook", issueBook);
router.post("/importBooks", upload.single("file"), importBooks);
router.get("/getBook", getBooks)

export default router;
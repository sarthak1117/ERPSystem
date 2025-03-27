// import express from "express";
// import {
//     markAttendance,
//     markHoliday,
//     getAttendanceDetails
// } from "../controllers/attendence.controller.js";
// import { uploadExcelCsv, uploadImage, uploadPDF } from "../middlewares/multer.middleware.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { checkPermission } from "../middlewares/permission.middleware.js";

// const router = express.Router();

// // Define required permissions for each route
// const markAttendancePermissions = ['admin', 'teacher'];
// const markHolidayPermissions = ['admin'];
// const getAttendanceDetailsPermissions = ['admin', 'teacher'];

// // Routes for marking attendance and holidays
// router.post("/markAttendence", 
//     verifyJWT, 
//     checkPermission(markAttendancePermissions), 
//     uploadImage.none(), 
//     uploadExcelCsv.none(), 
//     uploadPDF.none(), 
//     markAttendance
// );

// router.post("/markHoliday", 
//     verifyJWT, 
//     checkPermission(markHolidayPermissions), 
//     uploadImage.none(), 
//     uploadExcelCsv.none(), 
//     uploadPDF.none(), 
//     markHoliday
// );

// // Route for fetching attendance details
// router.get('/fetchAttendance', 
//     verifyJWT, 
//     checkPermission(getAttendanceDetailsPermissions), 
//     getAttendanceDetails
// );

// export default router;

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const __dirname = path.resolve();

const app = express();

// CORS setup
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true  // Corrected to lowercase 'credentials'
}));

// Body parsing middleware with limits
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Routes
import userRouter from './routes/user.routes.js';
// import studentInfoRouter from './routes/studentInfo.route.js';
// import academicsRouter from "./routes/academics.route.js";
// import academicFeesRouter from "./routes/academicFees.route.js";
// import expenseRouter from "./routes/expense.route.js";
import incomeRouter from "./routes/income.routes.js";
// import attendanceRouter from "./routes/attendence.route.js";
// import staffRouter from "./routes/staff.route.js";
// import leaveRouter from "./routes/leave.route.js";
// import ExaminationRouter from "./routes/Examination.route.js";
// import uploadCenterRouter from "./routes/uploadCenter.routes.js";
import departmentRouter from './routes/department.routes.js';
import designationRouter from './routes/designation.routes.js';



// // Mounting routes
app.use("/api/v1/users", userRouter);
// app.use("/api/v1/studentsInfo", studentInfoRouter);
// app.use("/api/v1/academics", academicsRouter);
// app.use("/api/v1/academicFees", academicFeesRouter);
app.use("/api/v1/income", incomeRouter);
// app.use("/api/v1/expense", expenseRouter);
// app.use("/api/v1/attendance", attendanceRouter);
// app.use("/api/v1/staff", staffRouter);
app.use("/api/v1/designation", designationRouter);
app.use("/api/v1/department", departmentRouter);
// app.use("/api/v1/leave", leaveRouter);
// app.use("/api/v1/Examination", ExaminationRouter);
// app.use("/api/v1/uploadContent", uploadCenterRouter);  // Corrected path by adding a leading slash

// Static file serving (uncomment if needed)
// app.use(express.static(path.join(__dirname, 'Frontend', 'dist')));

// Serve frontend
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'Frontend', 'dist', 'index.html'));
// });

export { app };

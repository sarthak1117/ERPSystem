const mongoose = require("mongoose");

const StudentAttendanceSchema = new mongoose.Schema(
  {
    studentInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    Date: {
      type: String,
      required: true,
    },
    Attendance: {
      type: String,
      enum: ["present", "absent", "leave", "half-day", "holiday"],
      required: true,
    },
    Note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);


const staffAttendanceSchema = new mongoose.Schema(
    {
      staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        required: true,
      },
      Role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true,
      },
      Date: {
        type: Date,
        required: true,
      },
      Attendance: {
        type: String,
        enum: ["present", "absent", "leave", "half-day", "holiday"],
        required: true,
      },
      Note: {
        type: String,
        default: "",
      },
    },
    { timestamps: true }
  );

  
export const StaffAttendance = mongoose.model("StaffAttendance", staffAttendanceSchema);

export const StudentAttendence = mongoose.model("StudentAttendance", StudentAttendanceSchema);
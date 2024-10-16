const markAttendance = asyncHandler(async (req, res) => {
    try {
        const { courseId, batchId, date, attendanceRecords } = req.body;

        if (!courseId) {
            throw new ApiError("Course ID is required", 400);
        }

        const course = await Course.findById(courseId);
        if (!course) {
            throw new ApiError("Course not found", 404);
        }

        if (!batchId) {
            throw new ApiError("Batch ID is required", 400);
        }

        const batch = await Batch.findOne({ course: courseId, _id: batchId });
        if (!batch) {
            throw new ApiError("Batch not found in the specified course", 404);
        }

        if (!date) {
            throw new ApiError("Date is required", 400);
        }

        if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
            throw new ApiError("Attendance records are required", 400);
        }

        const results = await Promise.all(
            attendanceRecords.map(async (record) => {
                const { studentId, Attendance: attendance, Note: note } = record;

                const validStatuses = ["present", "absent", "leave", "half-day", "holiday"];
                if (!validStatuses.includes(attendance)) {
                    throw new ApiError(Invalid attendance status: ${attendance}, 400);
                }

                const existingAttendance = await Attendance.findOne({
                    studentInfo: studentId,
                    course: courseId,
                    batch: batchId,
                    Date: date,
                });

                if (existingAttendance) {
                    existingAttendance.Attendance = attendance;
                    existingAttendance.Note = note;
                    await existingAttendance.save();

                    return {
                        studentId,
                        status: "updated",
                        attendance: existingAttendance,
                    };
                } else {
                    const newAttendance = new Attendance({
                        studentInfo: studentId,
                        course: courseId,
                        batch: batchId,
                        Date: date,
                        Attendance: attendance,
                        Note: note,
                    });

                    await newAttendance.save();

                    return {
                        studentId,
                        status: "created",
                        attendance: newAttendance,
                    };
                }
            })
        );

        res.status(200).json({
            success: true,
            message: "Attendance marked successfully",
            data: results,
        });
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});
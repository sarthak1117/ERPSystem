import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { Formik, Form, FieldArray } from "formik";
import { DateField, RadioButton, SelectField } from "../../components/FormElement/FormElement";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, fetchBatchesByCourse } from "../../redux/reducers/CourseSlice";
import DataViewTable from "../../components/FormElement/DisplayDataTable";
import { fetchStudents } from "../../redux/reducers/StudentSlice";
import { markAttendance, resetAttendanceState } from "../../redux/reducers/AttendenceSlice";

const MarkAttendance = () => {
  const dispatch = useDispatch();
  const { modifiedCourse: courses = [], batchesByCourse: batches = [] } = useSelector((state) => state.courses);
  const { students = [], loading: studentLoading, error: studentError } = useSelector((state) => state.students);
  const { loading, success, error } = useSelector((state) => state.attendance);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showStudents, setShowStudents] = useState(false);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCourse) {
      dispatch(fetchBatchesByCourse(selectedCourse));
    } else {
      setSelectedBatch("");
    }
  }, [selectedCourse, dispatch]);

  const handleCourseChange = (e, setFieldValue) => {
    const courseId = e.target.value;
    setShowStudents(false);
    setSelectedBatch("");
    setSelectedCourse(courseId);
    setFieldValue("batch", "");

    if (courseId) {
      dispatch(fetchBatchesByCourse(courseId));
    }
  };

  const handleSearch = (values, { setSubmitting }) => {
    if (values.course && values.batch) {
      dispatch(fetchStudents({ courseId: values.course, batchId: values.batch }));
      setShowStudents(true);
      setSelectedDate(values.date);
    }
    setSubmitting(false);
  };

  const handleAttendanceChange = (studentId, event, arrayHelpers) => {
    const { value } = event.target;
    arrayHelpers.replace(arrayHelpers.form.values.attendanceRecords.findIndex(record => record.studentId === studentId), { studentId, attendance: value });
  };

  const studentSchema = Yup.object().shape({
    course: Yup.string().required("Course is required"),
    batch: Yup.string().required("Batch is required"),
    date: Yup.string().required("Date is required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const data = {
      courseId: selectedCourse,
      batchId: selectedBatch,
      date: selectedDate,
      attendanceRecords: values.attendanceRecords,
    };
    dispatch(markAttendance(data));
    setSubmitting(false);
  };

  useEffect(() => {
    if (success) {
      alert("Attendance marked successfully");
      dispatch(resetAttendanceState());
    }
    if (error) {
      alert(`Error marking attendance: ${error}`);
    }
  }, [success, error, dispatch]);

  return (
    <Layout>
      <div className="flex flex-auto items-start -mt-10 -ml-4 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="space-y-8 bg-slate-50 shadow-2xl sm-rounded-lg w-full">
          <div className="border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
            <h2 className="text-2xl font-semibold leading-7 text-gray-900">
              Student Attendance
            </h2>
          </div>
          <Formik
            initialValues={{ course: "", batch: "", date: "", attendanceRecords: [] }}
            validationSchema={studentSchema}
            onSubmit={handleSearch}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="p-4 space-y-4">
                <div className="flex space-x-5 w-full">
                  <SelectField
                    className="px-30"
                    label="Course"
                    name="course"
                    options={courses.map((course) => ({
                      label: course.name,
                      value: course._id,
                    }))}
                    onChange={(e) => handleCourseChange(e, setFieldValue)}
                  />
                  <SelectField
                    name="batch"
                    options={
                      selectedCourse 
                        ? ( batches.length > 0 ? batches.map((batch) => ({
                              label: batch.name,
                              value: batch._id,
                            })): [{ label: "No batches available", value: "" }] ) : ([{ label: "Select a course first", value: "" }] )
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedBatch(value);
                      setShowStudents(false);
                      setFieldValue("batch", value);
                    }}
                    disabled={!selectedCourse}
                  />
                  <DateField
                    label="Date"
                    name="date"
                    placeholder="Select a date"
                  />
                </div>
                <div className="justify-end">
                  <button
                    type="submit"
                    className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-3 mt-3 rounded justify-end"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Searching..." : "Search"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div>
        {showStudents && (
          <Formik
            initialValues={{ attendanceRecords: students.map(student => ({ studentId: student._id, attendance: "absent" })) }}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form>
                <FieldArray name="attendanceRecords">
                  {arrayHelpers => (
                    <div>
                      {students.length > 0 && selectedCourse && selectedBatch && selectedDate && (
                        <DataViewTable
                          heading="Attendance"
                          fields={[
                            { key: "admissionNo", label: "Admission Number" },
                            { key: "studentName", label: "Student Name" },
                            { key: "rollNo", label: "Roll Number" },
                            {
                              key: "attendance",
                              label: "Attendance",
                              render: (row) => (
                                <AttendanceRadioButtons
                                  studentId={row.studentId}
                                  attendance={row.attendance}
                                  handleAttendanceChange={(e) => handleAttendanceChange(row.studentId, e, arrayHelpers)}
                                />
                              ),
                            },
                          ]}
                          data={students.map((student) => ({
                            ...student,
                            studentId: student._id,
                            attendance: values.attendanceRecords.find((record) => record.studentId === student._id)?.attendance,
                          }))}
                        />
                      )}
                    </div>
                  )}
                </FieldArray>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                  >
                    Submit Attendance
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </Layout>
  );
};

const AttendanceRadioButtons = ({ studentId, attendance, handleAttendanceChange }) => {
  return (
    <div className="flex space-x-4">
      <RadioButton
        name={`attendance-${studentId}`}
        value="present"
        checked={attendance === "present"}
        onChange={handleAttendanceChange}
        label="Present"
      />
      <RadioButton
        name={`attendance-${studentId}`}
        value="absent"
        checked={attendance === "absent"}
        onChange={handleAttendanceChange}
        label="Absent"
      />
    </div>
  );
};

export default MarkAttendance;


import React, { useEffect, useState } from "react";
// import Layout from "../../components/Layout/Layout";
// import { Formik, Form, FieldArray } from "formik";
// import { DateField, RadioButton, SelectField } from "../../components/FormElement/FormElement";
// import * as Yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCourses, fetchBatchesByCourse } from "../../redux/reducers/CourseSlice";
// import DataViewTable from "../../components/FormElement/DisplayDataTable";
// import { fetchStudents } from "../../redux/reducers/StudentSlice";
// import { markAttendance, resetAttendanceState } from "../../redux/reducers/AttendenceSlice";

// const MarkAttendance = () => {
//   const dispatch = useDispatch();
//   const { modifiedCourse: courses = [], batchesByCourse: batches = [] } = useSelector((state) => state.courses);
//   const { students = [], loading: studentLoading, error: studentError } = useSelector((state) => state.students);
//   const { loading, success, error } = useSelector((state) => state.attendance);

//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [selectedBatch, setSelectedBatch] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [attendanceRecords, setAttendanceRecords] = useState([]);
//   const [showStudents, setShowStudents] = useState(false);

//   useEffect(() => {
//     dispatch(fetchCourses());
//   }, [dispatch]);

//   useEffect(() => {
//     if (selectedCourse) {
//       dispatch(fetchBatchesByCourse(selectedCourse));
//     } else {
//       setSelectedBatch("");
//     }
//   }, [selectedCourse, dispatch]);

//   const handleCourseChange = (e, setFieldValue) => {
//     const courseId = e.target.value;
//     setShowStudents(false);
//     setSelectedBatch("");
//     setSelectedCourse(courseId);
//     setFieldValue("batch", "");

//     if (courseId) {
//       dispatch(fetchBatchesByCourse(courseId));
//     }
//   };

//   const handleSearch = (values, { setSubmitting }) => {
//     if (values.course && values.batch) {
//       dispatch(fetchStudents({ courseId: values.course, batchId: values.batch }));
//       setShowStudents(true);
//       setSelectedDate(values.date);
//     }
//     setSubmitting(false);
//   };

//   const handleAttendanceChange = (studentId, event) => {
//     const { value } = event.target;
//     setAttendanceRecords((prev) =>
//       prev.map((record) =>
//         record.studentId === studentId ? { ...record, attendance: value } : record
//       )
//     );
//   };

//   useEffect(() => {
//     if (students.length > 0) {
//       const initialAttendance = students.map((student) => ({
//         studentId: student._id,
//         attendance: "absent", // Default to absent
//       }));
//       setAttendanceRecords(initialAttendance);
//     }
//   }, [students]);

//   const studentSchema = Yup.object().shape({
//     course: Yup.string().required("Course is required"),
//     batch: Yup.string().required("Batch is required"),
//     date: Yup.string().required("Date is required"),
//   });

//   const handleSubmit = () => {
//     const data = {
//       courseId: selectedCourse,
//       batchId: selectedBatch,
//       date: selectedDate,
//       attendanceRecords,
//     };
//     dispatch(markAttendance(data));
//   };

//   useEffect(() => {
//     if (success) {
//       alert("Attendance marked successfully");
//       dispatch(resetAttendanceState());
//     }
//     if (error) {
//       alert(Error marking attendance: ${error});
//     }
//   }, [success, error, dispatch]);

//   return (
//     <Layout>
//       <div className="flex flex-auto items-start -mt-10 -ml-4 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//         <div className="space-y-8 bg-slate-50 shadow-2xl sm-rounded-lg w-full">
//           <div className="border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
//             <h2 className="text-2xl font-semibold leading-7 text-gray-900">
//               Student Attendance
//             </h2>
//           </div>
//           <Formik
//             initialValues={{ course: "", batch: "", date: "" }}
//             validationSchema={studentSchema}
//             onSubmit={handleSearch}
//           >
//             {({ isSubmitting, setFieldValue }) => (
//               <Form className="p-4 space-y-4">
//                 <div className="flex space-x-5 w-full">
//                   <SelectField
//                     className="px-30"
//                     label="Course"
//                     name="course"
//                     options={courses.map((course) => ({
//                       label: course.name,
//                       value: course._id,
//                     }))}
//                     onChange={(e) => handleCourseChange(e, setFieldValue)}
//                   />
//                   <SelectField
//                     name="batch"
//                     options={
//                       selectedCourse 
//                         ? ( batches.length > 0 ? batches.map((batch) => ({
//                               label: batch.name,
//                               value: batch._id,
//                             })): [{ label: "No batches available", value: "" }] ) : ([{ label: "Select a course first", value: "" }] )
//                     }
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       setSelectedBatch(value);
//                       setShowStudents(false);
//                       setFieldValue("batch", value);
//                     }}
//                     disabled={!selectedCourse}
//                   />
//                   <DateField
//                     label="Date"
//                     name="date"
//                     placeholder="Select a date"
//                   />
//                 </div>
//                 <div className="justify-end">
//                   <button
//                     type="submit"
//                     className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-3 mt-3 rounded justify-end"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? "Searching..." : "Search"}
//                   </button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </div>
//       <div>
//         {showStudents && (
//           <div>
//             {students.length > 0 && selectedCourse && selectedBatch && selectedDate && (
//               <DataViewTable
//                 heading="Attendance"
//                 fields={[
//                   { key: "admissionNo", label: "Admission Number" },
//                   { key: "studentName", label: "Student Name" },
//                   { key: "rollNo", label: "Roll Number" },
//                   {
//                     key: "attendance",
//                     label: "Attendance",
//                     render: (row) => (
//                       <FieldArray
//                         name="attendanceRecords"
//                         render={(arrayHelpers) => (
//                           <div>
//                             {row.attendance !== undefined && (
//                               <AttendanceRadioButtons
//                                 studentId={row.studentId}
//                                 attendance={row.attendance}
//                                 handleAttendanceChange={handleAttendanceChange}
//                               />
//                             )}
//                           </div>
//                         )}
//                       />
//                     ),
//                   },
//                 ]}
//                 data={students.map((student) => ({
//                   ...student,
//                   studentId: student._id,
//                   attendance: attendanceRecords.find((record) => record.studentId === student._id)?.attendance,
//                 }))}
//               />
//             )}
//           </div>
//         )}
//       </div>
//       <div className="flex justify-end">
//         <button
//           onClick={handleSubmit}
//           className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
//         >
//           Submit Attendance
//         </button>
//       </div>
//     </Layout>
//   );
// };



// const AttendanceRadioButtons = ({ studentId, attendance, handleAttendanceChange }) => {
//     return (
//       <div className="flex space-x-4">
//         <RadioButton
//           name={attendance-${studentId}}
//           value="present"
//           label="Present"
//           checked={attendance === "present"}
//           onChange={(e) => handleAttendanceChange(studentId, e)}
//         />
//         <RadioButton
//           name={attendance-${studentId}}
//           value="absent"
//           label="Absent"
//           checked={attendance === "absent"}
//           onChange={(e) => handleAttendanceChange(studentId, e)}
//         />
//         <RadioButton
//           name={attendance-${studentId}}
//           value="leave"
//           label="Leave"
//           checked={attendance === "leave"}
//           onChange={(e) => handleAttendanceChange(studentId, e)}
//         />
//         <RadioButton
//           name={attendance-${studentId}}
//           value="half-day"
//           label="Half-Day"
//           checked={attendance === "half-day"}
//           onChange={(e) => handleAttendanceChange(studentId, e)}
//         />
//       </div>
//     );
//   };

//   import React, { useEffect, useState } from "react";
// import Layout from "../../components/Layout/Layout";
// import { Formik, Form, FieldArray } from "formik";
// import { DateField, RadioButton, SelectField } from "../../components/FormElement/FormElement";
// import * as Yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCourses, fetchBatchesByCourse } from "../../redux/reducers/CourseSlice";
// import DataViewTable from "../../components/FormElement/DisplayDataTable";
// import { fetchStudents } from "../../redux/reducers/StudentSlice";
// import { markAttendance, resetAttendanceState } from "../../redux/reducers/AttendenceSlice";

// const MarkAttendance = () => {
//   const dispatch = useDispatch();
//   const { modifiedCourse: courses = [], batchesByCourse: batches = [] } = useSelector((state) => state.courses);
//   const { students = [], loading: studentLoading, error: studentError } = useSelector((state) => state.students);
//   const { loading, success, error } = useSelector((state) => state.attendance);

//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [selectedBatch, setSelectedBatch] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [showStudents, setShowStudents] = useState(false);

//   useEffect(() => {
//     dispatch(fetchCourses());
//   }, [dispatch]);

//   useEffect(() => {
//     if (selectedCourse) {
//       dispatch(fetchBatchesByCourse(selectedCourse));
//     } else {
//       setSelectedBatch("");
//     }
//   }, [selectedCourse, dispatch]);

//   const handleCourseChange = (e, setFieldValue) => {
//     const courseId = e.target.value;
//     setShowStudents(false);
//     setSelectedBatch("");
//     setSelectedCourse(courseId);
//     setFieldValue("batch", "");

//     if (courseId) {
//       dispatch(fetchBatchesByCourse(courseId));
//     }
//   };

//   const handleSearch = (values, { setSubmitting }) => {
//     if (values.course && values.batch) {
//       dispatch(fetchStudents({ courseId: values.course, batchId: values.batch }));
//       setShowStudents(true);
//       setSelectedDate(values.date);
//     }
//     setSubmitting(false);
//   };

//   const handleAttendanceChange = (studentId, event, arrayHelpers) => {
//     const { value } = event.target;
//     arrayHelpers.replace(arrayHelpers.form.values.attendanceRecords.findIndex(record => record.studentId === studentId), { studentId, attendance: value });
//   };

//   const studentSchema = Yup.object().shape({
//     course: Yup.string().required("Course is required"),
//     batch: Yup.string().required("Batch is required"),
//     date: Yup.string().required("Date is required"),
//   });

//   const handleSubmit = (values, { setSubmitting }) => {
//     const data = {
//       courseId: selectedCourse,
//       batchId: selectedBatch,
//       date: selectedDate,
//       attendanceRecords: values.attendanceRecords,
//     };
//     dispatch(markAttendance(data));
//     setSubmitting(false);
//   };

//   useEffect(() => {
//     if (success) {
//       alert("Attendance marked successfully");
//       dispatch(resetAttendanceState());
//     }
//     if (error) {
//       alert(`Error marking attendance: ${error}`);
//     }
//   }, [success, error, dispatch]);

//   return (
//     <Layout>
//       <div className="flex flex-auto items-start -mt-10 -ml-4 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//         <div className="space-y-8 bg-slate-50 shadow-2xl sm-rounded-lg w-full">
//           <div className="border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
//             <h2 className="text-2xl font-semibold leading-7 text-gray-900">
//               Student Attendance
//             </h2>
//           </div>
//           <Formik
//             initialValues={{ course: "", batch: "", date: "", attendanceRecords: [] }}
//             validationSchema={studentSchema}
//             onSubmit={handleSearch}
//           >
//             {({ isSubmitting, setFieldValue, values }) => (
//               <Form className="p-4 space-y-4">
//                 <div className="flex space-x-5 w-full">
//                   <SelectField
//                     className="px-30"
//                     label="Course"
//                     name="course"
//                     options={courses.map((course) => ({
//                       label: course.name,
//                       value: course._id,
//                     }))}
//                     onChange={(e) => handleCourseChange(e, setFieldValue)}
//                   />
//                   <SelectField
//                     name="batch"
//                     options={
//                       selectedCourse 
//                         ? ( batches.length > 0 ? batches.map((batch) => ({
//                               label: batch.name,
//                               value: batch._id,
//                             })): [{ label: "No batches available", value: "" }] ) : ([{ label: "Select a course first", value: "" }] )
//                     }
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       setSelectedBatch(value);
//                       setShowStudents(false);
//                       setFieldValue("batch", value);
//                     }}
//                     disabled={!selectedCourse}
//                   />
//                   <DateField
//                     label="Date"
//                     name="date"
//                     placeholder="Select a date"
//                   />
//                 </div>
//                 <div className="justify-end">
//                   <button
//                     type="submit"
//                     className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-3 mt-3 rounded justify-end"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? "Searching..." : "Search"}
//                   </button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </div>
//       </div>
//       <div>
//         {showStudents && (
//           <Formik
//             initialValues={{ attendanceRecords: students.map(student => ({ studentId: student._id, attendance: "absent" })) }}
//             onSubmit={handleSubmit}
//           >
//             {({ values }) => (
//               <Form>
//                 <FieldArray name="attendanceRecords">
//                   {arrayHelpers => (
//                     <div>
//                       {students.length > 0 && selectedCourse && selectedBatch && selectedDate && (
//                         <DataViewTable
//                           heading="Attendance"
//                           fields={[
//                             { key: "admissionNo", label: "Admission Number" },
//                             { key: "studentName", label: "Student Name" },
//                             { key: "rollNo", label: "Roll Number" },
//                             {
//                               key: "attendance",
//                               label: "Attendance",
//                               render: (row) => (
//                                 <AttendanceRadioButtons
//                                   studentId={row.studentId}
//                                   attendance={row.attendance}
//                                   handleAttendanceChange={(e) => handleAttendanceChange(row.studentId, e, arrayHelpers)}
//                                 />
//                               ),
//                             },
//                           ]}
//                           data={students.map((student) => ({
//                             ...student,
//                             studentId: student._id,
//                             attendance: values.attendanceRecords.find((record) => record.studentId === student._id)?.attendance,
//                           }))}
//                         />
//                       )}
//                     </div>
//                   )}
//                 </FieldArray>
//                 <div className="flex justify-end">
//                   <button
//                     type="submit"
//                     className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
//                   >
//                     Submit Attendance
//                   </button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         )}
//       </div>
//     </Layout>
//   );
// };

// const AttendanceRadioButtons = ({ studentId, attendance, handleAttendanceChange }) => {
//   return (
//     <div className="flex space-x-4">
//       <RadioButton
//         name={`attendance-${studentId}`}
//         value="present"
//         checked={attendance === "present"}
//         onChange={handleAttendanceChange}
//         label="Present"
//       />
//       <RadioButton
//         name={`attendance-${studentId}`}
//         value="absent"
//         checked={attendance === "absent"}
//         onChange={handleAttendanceChange}
//         label="Absent"
//       />
//     </div>
//   );
// };

// export default MarkAttendance;
 
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { Formik, Form } from "formik";
import { SelectField } from "../../components/FormElement/FormElement";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, fetchBatchesByCourse } from "../../redux/reducers/CourseSlice";
import DataViewTable from "../../components/FormElement/DisplayDataTable";
import { CgPlayListAdd } from "react-icons/cg";
import { addLibraryCardNumberStudent } from "../../redux/reducers/LibrarySlice";
import { deleteStudents, fetchStudents, resetStudents } from "../../redux/reducers/StudentSlice";

const StudentLibraryDetails = () => {
  const dispatch = useDispatch();
  const { modifiedCourse: courses = [], batchesByCourse: batches = [] } = useSelector((state) => state.courses);
  const { students = [], loading: studentLoading, error: studentError } = useSelector(state => state.students);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [libraryCardNumber, setLibraryCardNumber] = useState("");

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(resetStudents()); 
  }, [dispatch]);

  useEffect(() => {
    if (selectedCourse) {
      dispatch(fetchBatchesByCourse(selectedCourse));
      dispatch(resetStudents()); 
    } else {
      setSelectedBatch("");
      dispatch(resetStudents()); 
    }
  }, [selectedCourse, dispatch]);

  const handleCourseChange = (e, setFieldValue) => {
    const courseId = e.target.value;
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
    }
    setSubmitting(false);
  };

  const studentSchema = Yup.object().shape({
    course: Yup.string().required("Course is required"),
    batch: Yup.string().required("Batch is required"),
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const combinedStudents = students.map(student => {
    const { _id, ...rest } = student;
    return {
      ...rest,
      course: student.course?.name || 'Unknown Course',
      batch: student.batch?.name || 'Unknown Batch',
      studentName: `${student.FirstName} ${student.LastName}`,
      dateOfBirth: formatDate(student.DateOfBirth),
      admissionDate: formatDate(student.AdmissionDate),
      asOnDate: formatDate(student.AsOnDate),
      disableStudent: student.disableStudent
    };
  });

  const handleAddLibraryCard = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleLibraryCardSubmit = async (e) => {
    e.preventDefault();

    if (selectedStudent && libraryCardNumber) {
      try {
        await dispatch(
          addLibraryCardNumberStudent({
            studentId: selectedStudent._id,
            LibraryCardNo: libraryCardNumber,
          })
        );
        setLibraryCardNumber("");
        setIsModalOpen(false);
        setSelectedStudent(null);
      } catch (error) {
        console.error("Error adding library card number:", error);
      }
    } else {
      console.error("Selected student or library card number is missing.");
    }
  };

  return (
    <Layout>
      <div className="flex flex-auto items-start -mt-10 -ml-4 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="space-y-8 bg-slate-50 shadow-2xl sm-rounded-lg w-full">
          <div className="border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
            <h2 className="text-2xl font-semibold leading-7 text-gray-900">
              Student Details
            </h2>
          </div>
          <Formik
            initialValues={{ course: "", batch: "" }}
            validationSchema={studentSchema}
            onSubmit={handleSearch}
          >
            {({ isSubmitting, setFieldValue }) => (
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
                    onChange={(e) =>
                      handleCourseChange(e, setFieldValue)
                    }
                  />
                  <SelectField
                    label="Batch"
                    name="batch"
                    options={
                      selectedCourse
                        ? batches.length > 0
                          ? batches.map((batch) => ({
                              label: batch.name,
                              value: batch._id,
                            }))
                          : [{ label: "No batches available", value: "" }]
                        : [{ label: "Select a course first", value: "" }]
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedBatch(value);
                      setFieldValue("batch", value);
                    }}
                    disabled={!selectedCourse}
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
        <DataViewTable
          heading="Student List"
          data={combinedStudents}
          fields={[
            { key: "AdmissionNo", label: "Admission No" },
            { key: "RollNo", label: "Roll No" },
            { key: "studentName", label: "Student Name" },
            { key: "course", label: "Course" },
            { key: "batch", label: "Batch" },
            { key: "DateOfBirth", label: "Date of Birth" },
            { key: "Gender", label: "Gender" },
            { key: "MobileNumber", label: "Mobile Number" },
          ]}
          customActions={(row) => (
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white py-1 px-2 rounded"
              onClick={() => handleAddLibraryCard(row)}
            >
              <CgPlayListAdd />
            </button>
          )}
        />
      </div>

      {/* Modal for Adding Library Card Number */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add Library Card Number</h3>
            <form onSubmit={handleLibraryCardSubmit}>
              <div className="mb-4">
                <label htmlFor="libraryCardNumber" className="block text-sm font-medium text-gray-700">
                  Library Card Number
                </label>
                <input
                  type="text"
                  id="libraryCardNumber"
                  value={libraryCardNumber}
                  onChange={(e) => setLibraryCardNumber(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded"
                >
                  Add Library Card
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default StudentLibraryDetails;

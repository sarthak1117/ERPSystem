import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { Formik, Form } from "formik";
import { SelectField } from "../../components/FormElement/FormElement";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, fetchBatchesByCourse } from "../../redux/reducers/CourseSlice";
import DataViewTable from "../../components/FormElement/DisplayDataTable";
import { deleteStudents, fetchStudents } from "../../redux/reducers/StudentSlice";

const BulkDelete = () => {
  const dispatch = useDispatch();
  const { modifiedCourse: courses = [], batchesByCourse: batches = [] } = useSelector((state) => state.courses);
  const { students = [], loading: studentLoading, error: studentError } = useSelector(state => state.students);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  // Fetch courses on component mount
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Fetch batches whenever selectedCourse changes
  useEffect(() => {
    if (selectedCourse) {
      dispatch(fetchBatchesByCourse(selectedCourse));
    } else { 
      setSelectedBatch(""); // Reset batch if no course is selected
    }
  }, [selectedCourse, dispatch]);

  // Function to handle course change
  const handleCourseChange = (courseId, setFieldValue) => {
    setSelectedBatch("");
    setSelectedCourse(courseId);
    setFieldValue("batch", ""); // Reset the batch field in Formik
    if (courseId) {
      dispatch(fetchBatchesByCourse(courseId));
    }
  };

  const handleSearch = (values, { setSubmitting }) => {
    console.log('Form Values on Submit:', values);
    if (values.course && values.batch) {
      dispatch(fetchStudents({ courseId: values.course, batchId: values.batch }));
    }
    setSubmitting(false);
  };

  
  // Validation schema for Formik form
  const studentSchema = Yup.object().shape({
    course: Yup.string().required("Course is required"),
    batch: Yup.string().required("Batch is required"),
  });

  // const handleSelect = (ids, selectAll = false) => {
  //   if (selectAll) {
  //     setSelectedStudents(ids);
  //   } else {
  //     const updatedSelected = selectedStudents.includes(ids[0])
  //       ? selectedStudents.filter(id => id !== ids[0])
  //       : [...selectedStudents, ids[0]];
  //     setSelectedStudents(updatedSelected);
  //   }
  // };

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
      studentName: ${student.firstName} ${student.lastName},
      dateOfBirth: formatDate(student.dateOfBirth),
      admissionDate: formatDate(student.admissionDate),
      asOnDate: formatDate(student.asOnDate)
   // Format date here
    };
  });

  // const handleDelete = () => {
  //   if (selectedStudents.length > 0) {
  //     dispatch(deleteStudents({
  //       courseId: selectedCourse,
  //       batchId: selectedBatch,
  //       studentIds: selectedStudents,
  //     }));
  //     setSelectedCourse("");
  //     setSelectedBatch("");
  //   } else if (selectedBatch) {
  //     dispatch(deleteStudents({
  //       courseId: selectedCourse,
  //       batchId: selectedBatch,
  //       studentIds: [], // Ensure empty array if no students are selected
  //     }));
  //     setSelectedCourse("");
  //     setSelectedBatch("");
  //   } else if (selectedCourse) {
  //     dispatch(deleteStudents({
  //       courseId: selectedCourse,
  //       batchId: null,
  //       studentIds: [], // Ensure empty array if no students are selected
  //     }));
  //     setSelectedCourse("");
  //     setSelectedBatch("");
  //   } else {
  //     console.log("No course or batch selected to delete.");
  //   }
  // };

  const handleEdit = (student) => {
    console.log("Edit student:", student);
    // Implement edit logic here if needed
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
                    onChange={(courseId) =>
                      handleCourseChange(courseId, setFieldValue)
                    }
                  />
                  <SelectField
                    label="Batch"
                    name="batch"
                    options={
                      selectedCourse ? (
                        batches.length > 0 ? (
                          batches.map((batch) => ({
                            label: batch.name,
                            value: batch._id,
                          }))
                        ) : [{ label: "No batches available", value: "" }]
                      ) : [{ label: "Select a course first", value: "" }]
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedBatch(value);
                      setFieldValue('batch', value);
                    }}
                    disabled={!selectedCourse}
                  />
                </div>
                <div className="justify-end">
                  <button
                    type="submit"
                    className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-3 mt-3 rounded justify-end"
                    disabled={isSubmitting }
                  >
                    {isSubmitting ? "Searching..." : "Search"}
                  </button>
                </div>
                {/* {studentLoading && <div>Loading students...</div>}
                {studentError && <div>Error fetching students: {studentError}</div>} */}
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div>
        <DataViewTable
          heading="Student List"
          data={combinedStudents} // Replace with actual data if needed
          fields={[
            { key: "admissionNo", label: "Admission No" },
            { key: "studentName", label: "Student Name" },
            { key: "course", label: "Course" },
            { key: "batch", label: "Batch" },
            { key: "dateOfBirth", label: "Date of Birth" },
            { key: "gender", label: "Gender" },
            { key: "mobileNumber", label: "Mobile Number" },
            { key: "disableStudent", label: "Disable Student"}
          ]}
          onEdit={handleEdit}
          // onDelete={handleDelete}
          // selectable
          // onSelect={handleSelect}
          // onDeleteAction={handleDelete} // Add this if you want to make rows selectable 
          // onSelect={(selectedRowKeys) => {
          //   // Handle row selection logic here
          //   console.log('Selected Rows:', selectedRowKeys);
          // }}
        />
      </div>
    </Layout>
  );
};

export default BulkDelete;


import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { Formik, Form } from "formik";
import { SelectField } from "../../components/FormElement/FormElement";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, fetchBatchesByCourse } from "../../redux/reducers/CourseSlice";
import DataViewTable from "../../components/FormElement/DisplayDataTable";
import { deleteStudents, fetchStudents } from "../../redux/reducers/StudentSlice";

const BulkDelete = () => {
  const dispatch = useDispatch();
  const { modifiedCourse: courses = [], batchesByCourse: batches = [] } = useSelector((state) => state.courses);
  const { students = [], loading: studentLoading, error: studentError } = useSelector(state => state.students);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Fetch courses on component mount
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Fetch batches whenever selectedCourse changes
  useEffect(() => {
    if (selectedCourse) {
      dispatch(fetchBatchesByCourse(selectedCourse));
    } else {
      setSelectedBatch(""); // Reset batch if no course is selected
    }
  }, [selectedCourse, dispatch]);

  // Function to handle course change
  const handleCourseChange = (courseId, setFieldValue) => {
    setSelectedBatch("");
    setSelectedCourse(courseId);
    setFieldValue("batch", ""); // Reset the batch field in Formik
    if (courseId) {
      dispatch(fetchBatchesByCourse(courseId));
    }
  };

  const handleSearch = (values, { setSubmitting }) => {
    console.log('Form Values on Submit:', values);
    if (values.course && values.batch) {
      dispatch(fetchStudents({ courseId: values.course, batchId: values.batch }));
    }
    setSubmitting(false);
  };

  // Validation schema for Formik form
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
      studentName: `${student.firstName} ${student.lastName}`,
      dateOfBirth: formatDate(student.dateOfBirth),
      admissionDate: formatDate(student.admissionDate),
      asOnDate: formatDate(student.asOnDate),
      disableStudent: student.disableStudent // Ensure this field is included
    };
  });

  const handleEdit = (student) => {
    console.log("Edit student:", student);
    // Implement edit logic here if needed
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
                    onChange={(courseId) =>
                      handleCourseChange(courseId, setFieldValue)
                    }
                  />
                  <SelectField
                    label="Batch"
                    name="batch"
                    options={
                      selectedCourse ? (
                        batches.length > 0 ? (
                          batches.map((batch) => ({
                            label: batch.name,
                            value: batch._id,
                          }))
                        ) : [{ label: "No batches available", value: "" }]
                      ) : [{ label: "Select a course first", value: "" }]
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedBatch(value);
                      setFieldValue('batch', value);
                    }}
                    disabled={!selectedCourse}
                  />
                </div>
                <div className="justify-end">
                  <button
                    type="submit"
                    className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-3 mt-3 rounded justify-end"
                    disabled={isSubmitting }
                  >
                    {isSubmitting ? "Searching..." : "Search"}
                  </button>
                </div>
                {/* {studentLoading && <div>Loading students...</div>}
                {studentError && <div>Error fetching students: {studentError}</div>} */}
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div>
        <DataViewTable
          heading="Student List"
          data={combinedStudents} // Replace with actual data if needed
          fields={[
            { key: "admissionNo", label: "Admission No" },
            { key: "studentName", label: "Student Name" },
            { key: "course", label: "Course" },
            { key: "batch", label: "Batch" },
            { key: "dateOfBirth", label: "Date of Birth" },
            { key: "gender", label: "Gender" },
            { key: "mobileNumber", label: "Mobile Number" },
            { key: "disableStudent", label: "Disable Student"}
          ]}
          onEdit={handleEdit}
        />
      </div>
    </Layout>
  );
};

export default BulkDelete;

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
/>
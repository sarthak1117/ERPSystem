import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout/Layout";
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { SelectField, Upload } from "../../components/FormElement/FormElement";
import { fetchCourses, fetchBatchesByCourse } from "../../redux/reducers/CourseSlice";
import { importStudents } from "../../redux/reducers/studentSlice"; // Ensure the import path is correct

const ImportStudent = () => {
  const dispatch = useDispatch();
  const { modifiedCourse: courses = [], batchesByCourse: batches = [] } = useSelector((state) => state.courses);
  const { loading: studentLoading, error: studentError, success: studentSuccess } = useSelector((state) => state.students);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

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

  const handleCourseChange = (courseId, setFieldValue) => {
    setSelectedBatch("");
    setSelectedCourse(courseId);
    setFieldValue("batch", ""); // Reset the batch field in Formik
    if (courseId) {
      dispatch(fetchBatchesByCourse(courseId));
    }
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("courseId", values.course);
    formData.append("batchId", values.batch);
    formData.append("StudentData", values.StudentData);

    dispatch(importStudents(formData))
      .unwrap()
      .then(() => {
        setSubmitting(false);
        alert("File uploaded successfully!");
      })
      .catch((error) => {
        setSubmitting(false);
        alert("Failed to upload file: " + error.message);
      });
  };

  return (
    <Layout>
      <div className="flex flex-auto items-start -mt-10 -ml-4 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="space-y-8 bg-slate-50 shadow-2xl sm-rounded-lg w-full">
          <div className="border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
            <h2 className="text-2xl font-semibold leading-7 text-gray-900">Select Criteria</h2>
            <button type="button" className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-2 rounded">
              Download Sample File
            </button>
            <div>
              <p>
                1. Your CSV data should be in the format below. The first line of your CSV file should be the column headers as in the table
                example. Also make sure that your file is UTF-8 to avoid unnecessary encoding problems. 2. If the column you are trying to
                import is date make sure that is formatted in format Y-m-d (2018-06-06). 3. Duplicate Admission Number (unique) rows will not
                be imported. 4. For student Gender use Male, Female value. 5. For student Blood Group use O+, A+, B+, AB+, O-, A-, B-, AB-
                value. 6. For RTE use Yes, No value. 7. For If Guardian Is user father, mother, other value. 8. Category name comes from
                other table so for category, enter Category Id (Category Id can be found on category page ). 9. Student house comes from
                other table so for student house, enter Student House Id (Student House Id can be found on student house page ).
              </p>
            </div>
          </div>
          <Formik initialValues={{ course: "", batch: "", StudentData: null }} onSubmit={handleSubmit}>
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
                    onChange={(courseId) => handleCourseChange(courseId, setFieldValue)}
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
                  <Upload
                    label="Select a file"
                    name="StudentData"
                    onChange={(e) => setFieldValue("StudentData", e.target.files[0])}
                  />
                </div>
                <div className="justify-end">
                  <button
                    type="submit"
                    className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-3 mt-3 rounded justify-end"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Uploading..." : "Upload"}
                  </button>
                </div>
                {studentLoading && <div>Uploading students...</div>}
                {studentError && <div>Error uploading students: {studentError}</div>}
                {studentSuccess && <div>Students imported successfully!</div>}
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div></div>
    </Layout>
  );
};

export default ImportStudent;

import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { Formik, Form } from "formik";
import { DateField, InputField, RadioButton, Upload, SelectField } from "../../components/FormElement/FormElement";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, fetchBatchesByCourse } from "../../redux/reducers/CourseSlice";
import { uploadContent } from "../../redux/reducers/UploadContent"; // Add your thunk here

const UploadContent = () => {
  const dispatch = useDispatch();
  const { modifiedCourse: courses = [], batchesByCourse: batches = [] } = useSelector((state) => state.courses);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [availableToEveryone, setAvailableToEveryone] = useState(false);

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
    setSelectedBatch("");
    setSelectedCourse(courseId);
    setFieldValue("batch", "");

    if (courseId) {
      dispatch(fetchBatchesByCourse(courseId));
    }
  };

  const handleAvailableChange = (e, setFieldValue) => {
    const available = e.target.checked;
    setAvailableToEveryone(available);
    if (available) {
      setFieldValue("course", "");
      setFieldValue("batch", "");
    }
  };

  const initialValues = {
    ContentTitle: "",
    ContentType: "",
    Description: "",
    course: "",
    batch: "",
    file: null,
    availableToEveryone: false,
  };

  const validationSchema = Yup.object().shape({
    ContentTitle: Yup.string().required("Content Title is required"),
    ContentType: Yup.string().required("Content Type is required"),
    Description: Yup.string().required("Description is required"),
    course: Yup.string().when('availableToEveryone', {
      is: false,
      then: Yup.string().required("Course is required")
    }),
    batch: Yup.string().when('availableToEveryone', {
      is: false,
      then: Yup.string().required("Batch is required")
    }),
    file: Yup.mixed().required("File is required"),
    availableToEveryone: Yup.boolean(),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("ContentTitle", values.ContentTitle);
    formData.append("ContentType", values.ContentType);
    formData.append("Description", values.Description);
    if (!values.availableToEveryone) {
      formData.append("courseId", values.course);
      formData.append("batchId", values.batch);
    }
    formData.append("file", values.file);
    formData.append("availableToEveryone", values.availableToEveryone);

    dispatch(uploadContent(formData)).then(() => {
      setSubmitting(false);
    });
  };

  return (
    <Layout>
      <div className="flex flex-auto items-start -mt-10 -ml-4 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="space-y-8 bg-slate-50 shadow-2xl sm-rounded-lg w-full">
          <div className="border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
            <h2 className="text-2xl font-semibold leading-7 text-gray-900">
              Upload Study Material
            </h2>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="p-4 space-y-4">
                <div className="flex space-x-5 w-full">
                  <InputField
                    name="ContentTitle"
                    type="text"
                    placeholder="Content Title"
                    className="px-4 py-2 border rounded"
                  />
                  <SelectField
                    name="ContentType"
                    type="text"
                    placeholder="Content Type"
                    options={[
                      { label: "Assignment", value: "assignment" },
                      { label: "Study materials", value: "Study materials" },
                      { label: "Syllabus", value: "Syllabus" },
                      { label: "Other downloads", value: "other downloads" },
                    ]}
                    className="px-4 py-2 border rounded"
                  />
                </div>
                <div className="flex space-x-5 w-full">
                  <InputField
                    name="Description"
                    type="text"
                    placeholder="Description"
                    className="px-4 py-2 border rounded"
                  />
                </div>
                <div className="flex space-x-5 w-full">
                  <label>
                    <RadioButton
                      type="checkbox"
                      name="availableToEveryone"
                      onChange={(e) => handleAvailableChange(e, setFieldValue)}
                    />
                    Available to Everyone
                  </label>
                </div>
                {!availableToEveryone && (
                  <div className="flex space-x-5 w-full">
                    <SelectField
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
                          ? batches.length > 0
                            ? batches.map((batch) => ({
                                label: batch.name,
                                value: batch._id,
                              }))
                            : [{ label: "No batches available", value: "" }]
                          : [{ label: "Select a course first", value: "" }]
                      }
                      disabled={!selectedCourse}
                    />
                  </div>
                )}
                <div className="flex space-x-5 w-full">
                  <Upload
                    name="file"
                    type="file"
                    className="px-4 py-2 border rounded"
                    onChange={(event) => {
                      setFieldValue("file", event.currentTarget.files[0]);
                    }}
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
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export { UploadContent };

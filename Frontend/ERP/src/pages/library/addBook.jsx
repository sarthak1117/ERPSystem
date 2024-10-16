import React from "react";
import Layout from "../../components/Layout/Layout";
import { Formik, Form } from "formik";
import {
  DateField,
  InputField,
} from "../../components/FormElement/FormElement";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addBook } from "../../redux/reducers/LibrarySlice";
import { useNavigate } from "react-router-dom";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  BookTitle: Yup.string().required("Book title is required"),
  BookNumber: Yup.string().required("Book number is required"),
  ISBNNumber: Yup.string().required("ISBN number is required"),
  Publisher: Yup.string().required("Publisher is required"),
  Author: Yup.string().required("Author is required"),
  RackNumber: Yup.string().required("Rack number is required"),
  Quantity: Yup.number().required("Quantity is required"),
  BookPrice: Yup.number().required("Book price is required"),
  PostDate: Yup.date().required("Post date is required"),
});

const AddBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.library);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("Form values before dispatching:", values);

    const { ...bookDetails } = values;

    try {
      await dispatch(addBook(bookDetails)).unwrap();
      console.log("Book details submitted successfully");
      alert("Book information saved successfully!");

      // Reset form values
      resetForm();
    } catch (error) {
      console.error("Error saving book information:", error);
      alert("An error occurred while saving book information.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div>
        <div className="-m-6">
          <Formik
            initialValues={{
              BookTitle: "",
              BookNumber: "",
              ISBNNumber: "",
              Publisher: "",
              Author: "",
              RackNumber: "",
              Quantity: "",
              BookPrice: "",
              PostDate: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-auto items-start w-full">
                <div className="space-y-8 bg-slate-50 shadow-2xl rounded-lg w-full">
                  <div className="border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                      Add New Book
                    </h2>
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => navigate("/importBooks")}
                        className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-2 rounded"
                      >
                        Import Books
                      </button>
                    </div>
                  </div>
                  <div className="ml-3 mr-3 mt-10 mb-3 grid grid-cols-3 gap-x-6 gap-y-5 sm:grid-cols-12">
                    <InputField label="Book Title" name="BookTitle" />
                    <InputField label="Book Number" name="BookNumber" />
                    <InputField label="ISBN Number" name="ISBNNumber" />
                    <InputField label="Publisher" name="Publisher" />
                    <InputField label="Author" name="Author" />
                    <InputField label="Rack Number" name="RackNumber" />
                    <InputField label="Quantity" name="Quantity" type="number" />
                    <InputField label="Book Price" name="BookPrice" type="number" />
                    <DateField
                      label="Post Date"
                      name="PostDate"
                      placeholder="Select Date"
                    />
                  </div>
                  <div className="ml-3 mr-3 mt-10 mb-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-cyan-800 hover:bg-slate-400 text-white py-2 px-4 rounded"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default AddBook;


import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { Formik, Form } from "formik";
import {
  DateField,
  InputField,
  SelectField,
  TextAreaField,
  Upload,
} from "../../components/FormElement/FormElement";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { submitStudentDetails } from "../../redux/reducers/StudentSlice";
import {
  fetchCourses,
  fetchBatchesByCourse,
} from "../../redux/reducers/CourseSlice";
import { useNavigate } from "react-router-dom";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  
});

const AddBook = () => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { modifiedCourse: courses = [], batchesByCourse: batches = [] } =
    useSelector((state) => state.courses);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const { loading, error, success } = useSelector((state) => state.students);

  const toggleGuardianDetails = () => {
    setShowMoreDetails((prevState) => !prevState);
  };

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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log('Form values before dispatching:', values);
  
    const {
      StudentPhoto,
      FatherPhoto,
      Document,
      OtherDocument,
      ...studentDetails
    } = values;
  
    const files = {
      StudentPhoto: StudentPhoto,
      FatherPhoto: FatherPhoto,
      Document: Document,
      OtherDocument: OtherDocument,
    };
  
    console.log('Student details:', studentDetails);
    console.log('Files:', files);
  
    try {
      await dispatch(
        submitStudentDetails({
          courseId: studentDetails.course,
          batchId: studentDetails.batch,
          studentDetails,
          files,
        })
      ).unwrap();
      console.log('Student details submitted successfully');
      alert("Student information saved successfully!");
  
      // Reset form values and file inputs
      resetForm();
      document.querySelectorAll('input[type="file"]').forEach(input => {
        input.value = null;
      });
    } catch (error) {
      console.error("Error saving student information:", error);
      alert("An error occurred while saving student information.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div>
        <div className="-m-6">
          <Formik
            initialValues={{
              
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values, isSubmitting }) => (
              <Form className="flex flex-auto items-start w-full">
                <div className="space-y-8 bg-slate-50 shadow-2xl rounded-lg w-full">
                  <div className="border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                      Student Admission
                    </h2>
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => navigate("/importStudent")}
                        className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-2 rounded"
                      >
                        Import Student
                      </button>
                    </div>
                  </div>
                  <div className="ml-3 mr-3 mt-10 mb-3 grid grid-cols-3 gap-x-6 gap-y-5 sm:grid-cols-12">
                    <InputField label="Admission No" name="AdmissionNo" />
                    <InputField label="Roll Number" name="RollNo" />
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

                    <InputField label="First Name" name="FirstName" />
                    <InputField label="Last Name" name="LastName" />
                    <SelectField
                      label="Gender"
                      name="Gender"
                      options={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                      ]}
                    />
                    <DateField
                      label="Date of Birth"
                      placeholder="Select Date"
                      name="DateOfBirth"
                    />
                    <SelectField
                      label="Category"
                      name="Category"
                      options={[
                        { label: "General", value: "General" },
                        { label: "SC", value: "SC" },
                        { label: "ST", value: "ST" },
                        { label: "OBC", value: "OBC" },
                      ]}
                    />
                    <InputField label="Mobile Number" name="MobileNumber" />
                    <InputField label="Email" name="Email" />
                    <DateField
                      label="Admission Date"
                      name="AdmissionDate"
                      placeholder="Select Date"
                    />
                    <Upload
                      label="Student Photo"
                      name="StudentPhoto"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        console.log('StudentPhoto:', file);
                        setFieldValue("StudentPhoto", file);
                      }}
                    />
                    <InputField label="Student House" name="StudentHouse" />
                    <DateField
                      label="As On Date"
                      name="AsOnDate"
                      placeholder="Select Date"
                    />
                    <InputField label="Current Address" name="CurrentAddress" />
                    <InputField
                      label="Permanent Address"
                      name="PermanentAddress"
                    />
                  </div>
                  <div className="ml-3 mr-3 mt-10 mb-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-cyan-800 hover:bg-slate-400 text-white py-2 px-4 rounded"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default AddBook;
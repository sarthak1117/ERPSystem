
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { Formik, Form } from "formik";
import {
  InputField,
  MultiSelect,
  NumberInput,
} from "../../components/FormElement/FormElement";
import * as Yup from "yup";
import {
  addCourse,
  fetchBatches,
  fetchCourses,
  resetCourseState,
} from "../../redux/reducers/CourseSlice";
import DataViewTable from "../../components/FormElement/DisplayDataTable";
import { useDispatch, useSelector } from "react-redux";

// Validation schema using Yup
const AddCourse = () => {
  const dispatch = useDispatch();

  const { addCourseError, addCourseSuccess, batches, modifiedCourses } =
    useSelector((state) => state.courses);

  const initialValues = {
    name: "",
    duration: "",
    admissionCharge: "",
    courseCharge: "",
    batchIds: [],
  };

  const courseSchema = Yup.object().shape({
    name: Yup.string().required("Course is required"),
    duration: Yup.number()
      .required("Course Tenure is required")
      .positive("Must be positive")
      .integer("Must be an integer"),
    admissionCharge: Yup.number()
      .required("Admission Charge is required")
      .positive("Must be positive"),
    courseCharge: Yup.number()
      .required("Course Charge is required")
      .positive("Must be positive"),
    batchIds: Yup.array()
      .of(Yup.string())
      .required("At least one batch must be selected"),
  });

  useEffect(() => {
    dispatch(fetchBatches());
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (addCourseSuccess) {
      alert("Course added successfully!");
      dispatch(resetCourseState());
      dispatch(fetchCourses()); // Fetch courses after adding a new course
    }
  }, [addCourseSuccess, dispatch]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(addCourse(values)).unwrap();
      resetForm();
    } catch (error) {
      alert("Error adding course: " + error);
    } finally {
      setSubmitting(false);
    }
  };

  const batchOptions = batches
    ? batches.map((batch) => ({
        value: batch._id,
        label: batch.name,
      }))
    : [];

  const handleEdit = (course) => {
    console.log("Edit course:", course);
  };

  const handleDelete = (course) => {
    console.log("Delete course:", course);
  };

  return (
    <Layout>
      <div className="flex flex-auto items-start w-full -mt-10 -ml-4">
        <div className="space-y-8 bg-slate-50 shadow-2xl sm-rounded-lg w-full">
          <div className="border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
            <h2 className="text-2xl font-semibold leading-7 text-gray-900">
              Add Course
            </h2>
          </div>
          <div></div>
          <Formik
            initialValues={initialValues}
            validationSchema={courseSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="p-4 space-y-4">
                <div className="flex space-x-5 w-full">
                  <InputField label="Course" name="name" />
                  <NumberInput
                    label="Course Tenure (in Months)"
                    name="duration"
                  />
                  <NumberInput
                    label="Admission Charge"
                    name="admissionCharge"
                  />
                  <NumberInput label="Course Charge" name="courseCharge" />
                </div>
                <div className="w-full">
                  <MultiSelect
                    label="Batches"
                    name="batchIds"
                    options={batchOptions}
                  />
                </div>

                <div className="justify-end">
                  <button
                    type="submit"
                    className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-3 mt-3 rounded justify-end"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                  {addCourseError && (
                    <div className="text-red-500 text-sm mt-2">
                      {addCourseError}
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div>
        {/* Render the StudentTable component with course details */}
        <DataViewTable
          heading="Course List"
          data={modifiedCourses}
          fields={[
            "name",
            "duration",
            "admissionCharge",
            "courseCharge",
            "batches",
          ]}
          render={(course) => (
            <div>
              {course.batches.map((batch) => (
                <div key={batch._id}>{batch.name}</div>
              ))}
            </div>
          )}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </Layout>
  );
};

export default AddCourse;

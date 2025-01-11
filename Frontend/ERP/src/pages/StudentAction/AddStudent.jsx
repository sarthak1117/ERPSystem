import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Formik, Form } from "formik";
import {
  DateField,
  InputField,
  SelectField,
  TextAreaField,
  Upload,
} from "../components/FormElement/FormElement";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourseOptionsStart,
  fetchBatchOptionsStart,
} from "../redux/reducers/courseBatchSlice";
import { submitStudentDetails } from "../redux/reducers/StudentSlice";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  admissionNo: Yup.string().required("Admission No is required"),
  rollNumber: Yup.string().required("Roll Number is required"),
  course: Yup.string().required("Course is required"),
  batch: Yup.string().required("Batch is required"),
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string(),
  gender: Yup.string().required("Gender is required"),
  dateOfBirth: Yup.date().required("Date of Birth is required"),
  category: Yup.string(),
  mobileNumber: Yup.string(),
  email: Yup.string().email("Invalid email"),
  admissionDate: Yup.date(),
  studentPhoto: Yup.mixed(),
  studentHouse: Yup.string(),
  asOnDate: Yup.date(),
  currentAddress: Yup.string(),
  permanentAddress: Yup.string(),
  guardianNumber: Yup.string(),
  guardianName: Yup.string(),
  guardianRelation: Yup.string(),
  guardianOccupation: Yup.string(),
  guardianAddress: Yup.string(),
});

const StudentDetailsUpload = () => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const dispatch = useDispatch();
  const { courseOptions, batchOptions } = useSelector(
    (state) => state.courseBatch
  );
  const { loading, error, success } = useSelector((state) => state.studentData);

  const toggleGuardianDetails = () => {
    setShowMoreDetails((prevState) => !prevState);
  };

  useEffect(() => {
    dispatch(fetchCourseOptionsStart());
    dispatch(fetchBatchOptionsStart());
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(submitStudentDetails(values)).unwrap();
      alert("Student information saved successfully!");
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
              admissionNo: "",
              rollNumber: "",
              course: "",
              batch: "",
              firstName: "",
              lastName: "",
              gender: "",
              dateOfBirth: "",
              category: "",
              mobileNumber: "",
              email: "",
              admissionDate: "",
              studentPhoto: null,
              studentHouse: "",
              asOnDate: "",
              currentAddress: "",
              permanentAddress: "",
              guardianNumber: "",
              guardianName: "",
              guardianRelation: "",
              guardianOccupation: "",
              guardianAddress: "",
              note: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, isSubmitting }) => (
              <Form className="flex flex-auto items-start w-full">
                <div className="space-y-8 bg-slate-50 shadow-2xl rounded-lg w-full">
                  <div className="border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                      Student Admission
                    </h2>
                    <div className="flex justify-center">
                      <button
                        type="button"
                        className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-2 rounded"
                      >
                        Import Student
                      </button>
                    </div>
                  </div>
                  <div className="ml-3 mr-3 mt-10 mb-3 grid grid-cols-3 gap-x-6 gap-y-5 sm:grid-cols-12">
                    <InputField label="Admission No" name="admissionNo" />
                    <InputField label="Roll Number" name="rollNumber" />
                    <SelectField label="Course" name="course" options={courseOptions} />
                    <SelectField label="Batch" name="batch" options={batchOptions} />
                    <InputField label="First Name" name="firstName" />
                    <InputField label="Last Name" name="lastName" />
                    <InputField label="Gender" name="gender" />
                    <DateField label="Date of Birth" placeholder="Select Date" name="dateOfBirth" />
                    <SelectField label="Category" name="category" options={["General", "SC", "ST", "OBC"]} />
                    <InputField label="Mobile Number" name="mobileNumber" />
                    <InputField label="Email" name="email" type="email" />
                    <DateField label="Admission Date" name="admissionDate" placeholder="Select Date" />
                    <Upload label="Student Photo" name="studentPhoto" onChange={(e) => setFieldValue("studentPhoto", e.target.files[0])} />
                    <InputField label="Student House" name="studentHouse" />
                    <DateField label="As On Date" name="asOnDate" placeholder="Select Date" />
                    <InputField label="Current Address" name="currentAddress" />
                    <InputField label="Permanent Address" name="permanentAddress" />
                  </div>

                  <div className="mt-5 border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                      Guardian Details
                    </h2>
                  </div>
                  <div className="ml-3 mr-3 mt-10 mb-3 grid grid-cols-3 gap-x-6 gap-y-5 sm:grid-cols-12">
                    <InputField label="Guardian Number" name="guardianNumber" />
                    <Upload label="Father Photo" name="fatherPhoto" onChange={(e) => setFieldValue("fatherPhoto", e.target.files[0])} />
                    <InputField label="Guardian Name" name="guardianName" />
                    <InputField label="Guardian Relation" name="guardianRelation" />
                    <InputField label="Guardian Occupation" name="guardianOccupation" />
                    <InputField label="Guardian Address" name="guardianAddress" />
                  </div>

                  <div className="mt-5 border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                      Add More Details
                    </h2>
                    <button
                      type="button"
                      onClick={toggleGuardianDetails}
                      className="flex items-center text-2xl focus:outline-none"
                    >
                      {showMoreDetails ? "-" : "+"}
                    </button>
                  </div>

                  {showMoreDetails && (
                    <div className="ml-3 mr-3 mt-10 mb-3 grid grid-cols-3 gap-x-6 gap-y-8 sm:grid-cols-12">
                      <TextAreaField label="Note" name="note" />
                    </div>
                  )}

                  <div className="flex justify-end mr-2 mb-2">
                    <button
                      type="submit"
                      className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-4 rounded"
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting || loading ? "Saving..." : "Save"}
                    </button>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {success && <div className="text-green-500 text-sm">Student information saved successfully!</div>}
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

export default StudentDetailsUpload;

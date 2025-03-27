import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { submitStaffDetails } from '../../Redux/Reducer/humanResourceSlice';
import { fetchDepartments} from "../../Redux/Reducer/DepartmentSlice";
import { fetchDesignations } from "../../Redux/Reducer/DesignationSlice";
import Layout from "../../components/Layout/Layout";
import {
  InputField,
  SelectField,
  DateField,
  TextAreaField,
  Upload,
} from "../../components/FormElements/Fields";
import { Navigate } from "react-router-dom";

const maritalStatusOptions = [
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Widowed', label: 'Widowed' },
  ];
  
  const contractTypeOptions = [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Probation', label: 'Probation' },
    { value: 'Intern', label: 'Intern' },
  ];

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  StaffId: Yup.string().required("Staff ID is required"),
  Role: Yup.string().required("Role is required"),
  Designation: Yup.string().required("Designation is required"),
  Department: Yup.string().required("Department is required"),
  FirstName: Yup.string().required("First Name is required"),
  LastName: Yup.string().required("Last Name is required"),
  Gender: Yup.string().required("Gender is required"),
  DateOfBirth: Yup.date().required("Date of Birth is required"),
  Phone: Yup.string().required("Phone is required"),
  Email: Yup.string().email("Invalid email").required("Email is required"),
  EmergencyContactNumber: Yup.string(),
  maritalStatus: Yup.string().oneOf(['Single', 'Married', 'Divorced', 'Widowed']).required('Required'),
  contractType: Yup.string().oneOf(['Full-time', 'Part-time', 'Probation', 'Intern']).required('Required'),
  Address: Yup.string(),
  Qualification: Yup.string(),
  WorkExperience: Yup.string(),
  Note: Yup.string(),
  WorkShift: Yup.string(),
  EPFNo: Yup.string(),
  Basic: Yup.string(),
  AccountTitle: Yup.string(),
  BankAccountNumber: Yup.string(),
  BankName: Yup.string(),
  IFSCCode: Yup.string(),
  BankBranchName: Yup.string(),
  Location: Yup.string(),
  StaffPhoto: Yup.mixed(),
  Resume: Yup.mixed(),
  JoiningLetter: Yup.mixed(),
  OtherDocuments: Yup.mixed(),
});

const StaffDetailsUpload = () => {
  const dispatch = useDispatch();
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const { loading, error, success } = useSelector((state) => state.humanResource);
  const {  data: departments = [] } = useSelector((state) => state.department);  
  const { data: designations =[] } = useSelector((state) => state.designation); 
  const toggleGuardianDetails = () => {
    setShowMoreDetails((prevState) => !prevState);
  };

    useEffect(() => {
      dispatch(fetchDepartments());
      dispatch(fetchDesignations());
    }, [dispatch]); 


    const handleSubmit = async (values, { setSubmitting }) => {
      console.log("Form submitted with values:", values);
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });
      try {
        await dispatch(submitStaffDetails(formData)).unwrap();
        alert('Staff information saved successfully!');
      } catch (error) {
        if (error.message.includes("Staff ID already exists")) {
          alert("Error: Staff ID already exists. Please use a different ID.");
        } else {
          console.error("Error saving staff information:", error);
          alert("An error occurred while saving staff information.");
        }
      
      } finally {
        setSubmitting(false);
      }
    };

   const  Departmentoptions = departments.map((department) => ({
        label: department.Name,
        value: department._id,
      }))

     const Designationoptions = designations.map((designation) => ({
        label: designation.Name,
        value: designation._id,
      }))


    console.log("Departments:", departments);
    // console.log("Designations:", designations);



  return (
    <Layout>
      <div>
        <div className="-m-6">
          <Formik
            initialValues={{
              StaffId: "",
              Role: "",
              Designation: "",
              Department: "",
              FirstName: "",
              LastName: "",
              FatherName: "",
              MotherName: "",
              Email: "",
              Gender: "",
              DateOfBirth: "",
              Phone: "",
              EmergencyContactNumber: "",
              MaritalStatus: "",
              Address: "",
              Qualification: "",
              WorkExperience: "",
              Note: "",
              ContractType: "",
              WorkShift: "",
              EPFNo: "",
              Basic: "",
              AccountTitle: "",
              BankAccountNumber: "",
              BankName: "",
              IFSCCode: "",
              BankBranchName: "",
              Location: "",
              StaffPhoto: null,
              Resume: null,
              JoiningLetter: null,
              OtherDocuments: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, isSubmitting }) => (
              <Form className="flex flex-auto items-start w-full">
                <div className="space-y-8 bg-slate-50 shadow-2xl rounded-lg w-full">
                  <div className="border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                      Add Staff Details
                    </h2>
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => Navigate("/importStaff")}
                        className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-2 rounded"
                      >
                        Import Staff
                      </button>
                    </div>
                  </div>
                  <div className="ml-3 mr-3 mt-10 mb-3 grid grid-cols-3 gap-x-6 gap-y-5 sm:grid-cols-12">
                    <InputField label="Staff ID" name="StaffId" />
                    <InputField label="Role" name="Role" />
                    <SelectField
                      label="Department"
                      name="Department"
                      options={Departmentoptions}
                    />
                    <SelectField
                      label="Designation"
                      name="Designation"
                      options={Designationoptions}
                    />
                    <InputField label="First Name" name="FirstName" />
                    <InputField label="Last Name" name="LastName" />
                    <InputField label="Father's Name" name="FatherName" />
                    <InputField label="Mother's Name" name="MotherName" />
                    <InputField label="Email" name="Email" type="email" />
                    <InputField label="Gender" name="Gender" />
                    <DateField
                      label="Date of Birth"
                      placeholder="Select Date"
                      name="DateOfBirth"
                    />
                    <InputField label="Phone" name="Phone" />
                    <InputField
                      label="Emergency Contact Number"
                      name="EmergencyContactNumber"
                    />
                    <SelectField label="Marital Status" name="MaritalStatus" options={maritalStatusOptions}/>
                    <InputField label="Address" name="Address" />
                    <InputField label="Qualification" name="Qualification" />
                    <InputField label="Work Experience" name="WorkExperience" />
                    <TextAreaField label="Note" name="Note" />

                    <Upload
                      label="Staff Photo"
                      name="StaffPhoto"
                      onChange={(e) =>
                        setFieldValue("StaffPhoto", e.target.files[0])
                      }
                    />
                  </div>
                  {/* <div className="flex items-center justify-end pb-6 mr-3">
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Save"}
                    </button>
                  </div> */}
                  <div className="mt-5 border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900 ">
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
                    <div>
                    <div className="ml-3 mr-3 mt-10 mb-3  gap-x-5 gap-y-8 sm:grid-cols-12">
                      <div className="mt-5 border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
                        <h2 className="text-xl font-semibold leading-7 text-gray-900">
                          Payroll
                        </h2>
                      </div>
                      <div className="ml-3 mr-3 mt-10 mb-3 grid grid-cols-3 gap-x-6 gap-y-5 sm:grid-cols-12">
                      <InputField label="EPF No" name="EPFNo" />
                      <InputField label="Basic" name="Basic" />
                        <InputField label="Work Shift" name="WorkShift" />
                        <SelectField
                          label="Contract Type"
                          name="ContractType"
                          options= {contractTypeOptions}
                        />
                        <InputField label="Location" name="Location" />
                      </div>
                    </div>

                    <div className="ml-3 mr-3 mt-10 mb-3 gap-x-5 gap-y-8 sm:grid-cols-12">
                    <div className="mt-5 border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
                       <h2 className="text-xl font-semibold leading-7 text-gray-900">
                         Bank Account Details
                       </h2>
                     </div>
                      <div className="ml-3 mr-3 mt-10 mb-3 grid grid-cols-3 gap-x-6 gap-y-5 sm:grid-cols-12">
                      <InputField label="Account Title" name="AccountTitle" />
                    <InputField
                      label="Bank Account Number"
                      name="BankAccountNumber"
                    />
                    <InputField label="Bank Name" name="BankName" />
                    <InputField label="IFSC Code" name="IFSCCode" />
                    <InputField
                      label="Bank Branch Name"
                      name="BankBranchName"
                    />
                      </div>
                    </div>
                    <div className="ml-3 mr-3 mt-10 mb-3 gap-x-5 gap-y-8 sm:grid-cols-12">
                      <div className="mt-5 border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
                        <h2 className="text-xl font-semibold leading-7 text-gray-900">
                          Upload Documents
                        </h2>
                      </div>
                      <div className="ml-3 mr-3 mt-10 mb-3 grid grid-cols-3 gap-x-6 gap-y-5 sm:grid-cols-12">
                        <Upload
                          label="Resume"
                          name="Resume"
                          onChange={(e) =>
                            setFieldValue("Resume", e.target.files[0])
                          }
                        />
                        <Upload
                          label="Joining Letter"
                          name="JoiningLetter"
                          onChange={(e) =>
                            setFieldValue("JoiningLetter", e.target.files[0])
                          }
                        />
                        <Upload
                          label="Other Documents"
                          name="OtherDocuments"
                          onChange={(e) =>
                            setFieldValue("OtherDocuments", e.target.files[0])
                          }
                        />
                      </div>
                    </div>
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
                    {error && (
                      <div className="text-red-500 text-sm">{error}</div>
                    )}
                    {success && (
                      <div className="text-green-500 text-sm">
                        Student information saved successfully!
                      </div>
                    )}
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

export default StaffDetailsUpload; 
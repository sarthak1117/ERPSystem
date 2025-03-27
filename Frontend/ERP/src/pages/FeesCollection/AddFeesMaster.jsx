import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { Formik, Form } from "formik";
import { DateField, InputField, SelectField } from "../../components/FormElement/FormElement";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createFeesGroup,
  fetchFeesGroups,
  fetchFeesTypes,
} from "../../redux/reducers/AcademicFeesSlice"; 
import DataViewTable from "../../components/FormElement/DisplayDataTable";
import { fetchCourses } from "../../redux/reducers/CourseSlice";

const validationSchema = Yup.object( ).shape({
    FeesGroupType: Yup.string().required("Group Type is required"),
    FeesGroupName: Yup.string().required("Name is required"),
    Description: Yup.string(),
    
    Amount: Yup.number().required("Amount is required"),
    DueDate: Yup.date().required("Due Date is required"),
    FineType: Yup.string().required("Fine Type is required"),
    Percentage: Yup.number().when('FineType', {
      is: 'Percentage',
      then: Yup.number().min(0).max(100).required("Percentage is required when Fine Type is 'Percentage'"),
      otherwise: Yup.number().notRequired(),
    }),
    FineAmount: Yup.number().when('FineType', {
      is: 'Fix Amount',
      then: Yup.number().min(0).required("Fine Amount is required when Fine Type is 'Fix Amount'"),
      otherwise: Yup.number().notRequired(),
    }),
  });

  const AddFeesMaster = () => {
    const dispatch = useDispatch();
    const { feesGroups = [], feesTypes = [], loading, error, success } = useSelector((state) => state.fees); 
    const { modifiedCourse: courses = [] } = useSelector((state) => state.courses);
  
    const [selectedFineType, setSelectedFineType] = useState("None");
  
    useEffect(() => {
      dispatch(fetchFeesTypes());
      dispatch(fetchFeesGroups()); 
      dispatch(fetchCourses());  // Ensure fetchCourses is called to populate course options
    }, [dispatch]);
  
    const handleFineTypeChange = (e, setFieldValue) => {
      const fineType = e.target.value;
      setSelectedFineType(fineType);
      setFieldValue("FineType", fineType);
      if (fineType !== "Percentage") setFieldValue("Percentage", "");
      if (fineType !== "Fix Amount") setFieldValue("FineAmount", "");
    };
  
    const handleSubmit = (values, { setSubmitting, resetForm }) => {
      dispatch(createFeesMaster(values))
        .unwrap()
        .then(() => {
          setSubmitting(false);
          resetForm();
        })
        .catch((err) => {
          setSubmitting(false);
          console.error("Failed to create Fees Master:", err);
        });
    };
  
    const combinedFees = feesGroups.map(fee => {
      const course = courses.find(course => course._id === fee.course); 
    
      return {
        ...fee,
        course: course ? course.name : 'Unknown Course', 
      };
    });
  
    const handleDelete = (id) => {
      // Implement delete functionality if needed
    };
  
    const handleEdit = (feesGroup) => {
      console.log("Edit fees group:", feesGroup);
    };
  
    return (
      <Layout>
        <div className="flex flex-wrap w-full -mt-6">
          <div className="w-full md:w-1/2 px-4 mb-4 sm-rounded-lg">
            <div className="bg-slate-50 -ml-8 shadow-2xl rounded-lg p-8">
              <div className="border-b border-gray-400 pb-8 flex items-center justify-between">
                <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                  Add Fees Master
                </h2>
              </div>
              <Formik
                initialValues={{ FeesGroupType: "", FeesGroupName: "", Description: "", course: "", Amount: "", DueDate: "", FineType: "None", Percentage: "", FineAmount: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}  // Use handleSubmit for form submission
              >
                {({ isSubmitting, setFieldValue, values }) => (
                  <Form className="space-y-4">
                    <div className="flex flex-col w-1/2">
                      <SelectField
                        label="Fees Group"
                        name="FeeGroup"
                        options={feesGroups.map((FeesGroup) => ({
                          label: FeesGroup.FeesGroupName,
                          value: FeesGroup._id,
                        }))}
                        onChange={(e) => setFieldValue("FeesGroup", e.target.value)}
                      />
  
                      <SelectField
                        label="Fee Type"
                        name="FeeType"
                        options={feesTypes.map((FeesType) => ({
                          label: FeesType. FeesTypeName,
                          value: FeesType._id,
                        }))}
                        onChange={(e) => setFieldValue("FeesType", e.target.value)}
                      />
                      <DateField label="Due Date" name="DueDate" />
                      <InputField label="Amount" name="Amount" />
  
                      <div>
                        <label className="block mt-2 text-sm font-medium text-black-700">Fine Type</label>
                        <div className="flex items-center mt-2">
                          <label className="mr-4 mt-2">
                            <input
                              type="radio"
                              name="FineType"
                              value="None"
                              checked={selectedFineType === "None"}
                              onChange={(e) => handleFineTypeChange(e, setFieldValue)}
                            /> None
                          </label>
                          <label className="mr-4 mt-2">
                            <input
                              type="radio"
                              name="FineType"
                              value="Percentage"
                              checked={selectedFineType === "Percentage"}
                              onChange={(e) => handleFineTypeChange(e, setFieldValue)}
                            /> Percentage
                          </label>
                          <label className="mr-4 mt-2">
                            <input
                              type="radio"
                              name="FineType"
                              value="Fix Amount"
                              checked={selectedFineType === "Fix Amount"}
                              onChange={(e) => handleFineTypeChange(e, setFieldValue)}
                            /> Fix Amount
                          </label>
                        </div>
                      </div>
  
                      {selectedFineType === "Percentage" && (
                        <InputField label="Percentage (%)" name="Percentage" />
                      )}
  
                      {selectedFineType === "Fix Amount" && (
                        <InputField label="Fine Amount" name="FineAmount" />
                      )}
                    </div>
  
                    <div className="justify-end">
                      <button
                        type="submit"
                        className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-3 mt-3 rounded"
                        disabled={isSubmitting || loading}
                      >
                        {isSubmitting || loading ? "Submitting..." : "Submit"}
                      </button>
                    </div>
  
                    {error && typeof error === 'string' && <div className="text-red-600 mt-2">{error}</div>}
                    {success && <div className="text-green-600 mt-2">Fees Master added successfully!</div>}
                  </Form>
                )}
              </Formik>
            </div>
          </div>
  
          <div className="w-full md:w-1/2 sm-rounded-lg -mt-6">
            <DataViewTable
              heading="Fees Master"
              data={combinedFees}
              fields={[
                { key: "FeeGroup", label: "Fees Group" },
                { key: "FeeType", label: "Fees Code" },
                { key: "Amount", label: "Amount" },
              ]}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </div>
        </div>
      </Layout>
    );
  };
  
  export default AddFeesMaster;
  
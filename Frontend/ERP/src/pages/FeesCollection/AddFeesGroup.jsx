import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { Formik, Form } from "formik";
import { InputField, SelectField, TextAreaField } from "../../components/FormElement/FormElement";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createFeesGroup,
  fetchFeesGroups,
} from "../../redux/reducers/AcademicFeesSlice"; // Updated Slice
import DataViewTable from "../../components/FormElement/DisplayDataTable";
import { fetchCourses } from "../../redux/reducers/CourseSlice";

const validationSchema = Yup.object().shape({
    FeesGroupType: Yup.string().required("Group Type is required"),
    FeesGroupName: Yup.string().required("Name is required"),
    Description: Yup.string(),
    course: Yup.string().when('FeesGroupType', {
      is: 'Class',
      then: ()=>  Yup.string().required("Course is required"),
      otherwise: ()=>  Yup.string().notRequired()
    }),
  });
// const validationSchema = Yup.object().shape({
//     FeesGroupType: Yup.string().required("Group Type is required"),
//     FeesGroupName: Yup.string().required("Name is required"),
//     Description: Yup.string(),
//     course: Yup.string() // Temporarily make this optional
//   });

const AddFeesGroup = () => {
  const dispatch = useDispatch();
  const { feesGroups = [], loading, error, success } = useSelector((state) => state.fees); // Updated state selector
  const { modifiedCourse: courses = [] } = useSelector((state) => state.courses);

  const [selectedGroupType, setSelectedGroupType] = useState("");

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchFeesGroups()); // Updated action dispatch
  }, [dispatch]);

  const handleGroupTypeChange = (e, setFieldValue) => {
    const groupType = e.target.value;
    setSelectedGroupType(groupType);
    setFieldValue("course", "");
  };

  const handleSubmit = (values, { resetForm }) => {
    console.log("Submitted Values:", values);
  
    // Map course field to courseId field
    const payload = {
      ...values,
      courseId: values.course, // Map the course field to courseId
    };
  
    // Remove the course field from the payload to avoid sending it twice
    delete payload.course;
  
    dispatch(createFeesGroup(payload)).then((result) => {
      if (createFeesGroup.fulfilled.match(result)) {
        resetForm();
      }
    });
  };

  const combinedFees = feesGroups.map(fee => {
    const { _id, ...rest } = fee;
    return {
      ...rest,
      course: feesGroups.course?.name || 'Unknown Course',
      
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
                Add Fees Group
              </h2>
            </div>
            <Formik
              initialValues={{ FeesGroupType: "", FeesGroupName: "", Description: "", course:"" }}
              validationSchema={validationSchema}
              validate={(values) => {
                console.log("Validating Values:", values); // Log values before validation
                const errors = {};
                // Validate manually or rely on Yup
                return errors;
              }}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form className="space-y-4">
                  <div className="flex flex-col  w-1/2">
                    <SelectField
                      label="Group Type"
                      name="FeesGroupType"
                      options={[
                        { label: "Class", value: "Class" },
                        { label: "Transport", value: "Transport" },
                      ]}
                      onChange={(e) => handleGroupTypeChange(e, setFieldValue)}
                    />

                    {/* Conditionally render the Course field */}
                    {selectedGroupType === "Class" && (
                      <SelectField
                        className="px-30"
                        label="Course"
                        name="course"
                        options={courses.map((course) => ({
                          label: course.name,
                          value: course._id,
                        }))}
                        onChange={(e) => setFieldValue("course", e.target.value)}
                      />
                    )}

                    <InputField label="Name" name="FeesGroupName" />
                    <TextAreaField label="Description" name="Description" />
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
                  {success && <div className="text-green-600 mt-2">Fees group added successfully!</div>}
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div className="w-full md:w-1/2 sm-rounded-lg -mt-6">
          <DataViewTable
            heading="Fees Groups"
            data={combinedFees}
            fields={[
                { key: "course", label: "Class" },
              { key: "FeesGroupName", label: "Name" },
              { key: "FeesGroupType", label: "Group Type" },
            ]}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AddFeesGroup; 
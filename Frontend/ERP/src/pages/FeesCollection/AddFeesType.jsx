import React, { useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { Formik, Form } from "formik";
import { InputField, TextAreaField } from "../../components/FormElement/FormElement";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  addFeesType,
  fetchFeesTypes,
  resetSuccess,
} from "../../features/feesTypesSlice";
import DataViewTable from "../../components/FormElement/DisplayDataTable";

const validationSchema = Yup.object().shape({
  FeesTypeName: Yup.string().required("Name is required"),
  FeesTypeCode: Yup.string().required("Fees Code is required"),
  Description: Yup.string().required("Description is required"),
});

const AddFeesType = () => {
  const dispatch = useDispatch();
  const { feesTypes = [], loading, error, success } = useSelector((state) => state.feesTypes);

  useEffect(() => {
    dispatch(fetchFeesTypes());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetSuccess());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleSubmit = (values, { resetForm }) => {
    dispatch(addFeesType(values)).then((result) => {
      if (addFeesType.fulfilled.match(result)) {
        resetForm();
      }
    });
  };

  const handleDelete = (id) => {
    // Implement delete functionality if needed
  };

  const handleEdit = (feesType) => {
    console.log("Edit fees type:", feesType);
  };

  return (
    <Layout>
      <div className="flex flex-wrap w-full -mt-6">
        <div className="w-full md:w-1/2 px-4 mb-4 sm-rounded-lg">
          <div className="bg-slate-50 -ml-8 shadow-2xl rounded-lg p-8">
            <div className="border-b border-gray-400 pb-8 flex items-center justify-between">
              <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                Add Fees Type
              </h2>
            </div>
            <Formik
              initialValues={{ FeesTypeName: "", FeesTypeCode: "", Description: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="flex flex-col  w-1/2">
                    <InputField label="Name" name="FeesTypeName" />
                    <InputField label="Fees Code" name="FeesTypeCode" />
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
                  {success && <div className="text-green-600 mt-2">Fees type added successfully!</div>}
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div className="w-full md:w-1/2 sm-rounded-lg -mt-6">
          <DataViewTable
            heading="Fees Types"
            data={feesTypes}
            fields={[{ key: "FeesTypeName", label: "Name" },
                    { key: "FeesTypeCode", label: "Fees Code" },
                    { key: "Description", label: "Description" },
            ]}
            onDelete={handleDelete}
            onEdit={handleEdit}
            selectable
          />
        </div>
      </div>
    </Layout>
  );
};

export default AddFeesType;

import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { Formik, Form } from "formik";
import { InputField, TextAreaField } from "../../components/FormElements/Fields";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchIncomeHeads,
  createIncomeHead,
  updateIncomeHead,
  deleteIncomeHead,
} from "../../Redux/Reducer/IncomeHeadslice"; // Updated Slice
import DataViewTable from "../../components/FormElements/DataViewTable";

const validationSchema = Yup.object().shape({
  IncomeHead: Yup.string().required("Income Head is required"),
  Description: Yup.string(),
});

const AddIncomeHead = () => {
  const dispatch = useDispatch();
  const { data: incomeHeads = [], loading, error } = useSelector(
    (state) => state.incomeHead
  );

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch all income heads on component mount
  useEffect(() => {
    dispatch(fetchIncomeHeads());
  }, [dispatch]);

  // Handle Form Submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (editing) {
        await dispatch(updateIncomeHead({ id: editData._id, data: values })).unwrap();
        alert("Income Head updated successfully!");
        setEditing(false);
        setEditData(null);
      } else {
        await dispatch(createIncomeHead(values)).unwrap();
        alert("Income Head created successfully!");
      }
      resetForm();
    } catch (err) {
      alert(`Error: ${err}`);
    }
  };

  // Handle Edit
  const handleEdit = (data) => {
    setEditing(true);
    setEditData(data);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this income head?")) {
      try {
        await dispatch(deleteIncomeHead(id)).unwrap();
        alert("Income Head deleted successfully!");
      } catch (err) {
        alert(`Error: ${err}`);
      }
    }
  };

  return (
    <Layout>
      <div className="flex flex-wrap w-full -mt-6">
        {/* Form Section */}
        <div className="w-full md:w-1/2 px-4 mb-4 sm-rounded-lg">
          <div className="bg-slate-50 -ml-8 shadow-2xl rounded-lg p-8">
            <div className="border-b border-gray-400 pb-8 flex items-center justify-between">
              <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                {editing ? "Edit Income Head" : "Add Income Head"}
              </h2>
            </div>
            <Formik
              initialValues={{
                IncomeHead: editData?.IncomeHead || "",
                Description: editData?.Description || "",
              }}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="flex flex-col w-1/2">
                    <InputField label="Income Head" name="IncomeHead" />
                    <TextAreaField label="Description" name="Description" />
                  </div>
                  <div className="justify-end">
                    <button
                      type="submit"
                      className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-3 mt-3 rounded"
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting || loading
                        ? "Submitting..."
                        : editing
                        ? "Update"
                        : "Submit"}
                    </button>
                  </div>
                  {error && typeof error === "string" && (
                    <div className="text-red-600 mt-2">{error}</div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="w-full md:w-1/2 sm-rounded-lg -mt-6 p-4">
          <DataViewTable
            heading="Income Head List"
            data={incomeHeads}
            fields={[
              { key: "IncomeHead", label: "Income Head" },
              { key: "Description", label: "Description" },
            ]}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AddIncomeHead; 
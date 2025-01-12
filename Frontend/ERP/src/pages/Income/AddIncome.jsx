import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { Formik, Form } from "formik";
import { DateField, InputField, NumberInput, SelectField, TextAreaField, Upload } from "../../components/FormElements/Fields";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createIncome,
  fetchIncomes,
  updateIncome,
  deleteIncome,
} from "../../Redux/Reducer/IncomeSlice"; // Updated Slice
import DataViewTable from "../../components/FormElements/DataViewTable";
import { fetchIncomeHeads } from "../../Redux/Reducer/IncomeHeadslice";

const validationSchema = Yup.object().shape({
  IncomeHead: Yup.string().required("Income Head is required"),
  InvoiceNumber: Yup.string(),
  Name: Yup.string(),
  Date:  Yup.string(),
  Amount: Yup.string(),
  Description: Yup.string(),
});

const AddIncome = () => {
  const dispatch = useDispatch();
  const { data: incomes = [], loading, error } = useSelector(
    (state) => state.income
  );
    const { data: incomeHeads = [] } = useSelector(
      (state) => state.incomeHead
    );

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch all income heads on component mount
  useEffect(() => {
    dispatch(fetchIncomes())
    dispatch(fetchIncomeHeads());
  }, [dispatch]);

  

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const  IncomeHeadoptions = incomeHeads.map((incomeHead) => ({
    label: incomeHead.IncomeHead,
    value: incomeHead._id,
  }))

  // Handle Form Submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (editing) {
        await dispatch(updateIncome({ id: editData._id, data: values })).unwrap();
        alert("Income Head updated successfully!");
        setEditing(false);
        setEditData(null);
      } else {
        await dispatch(createIncome(values)).unwrap();
        alert("Income Head created successfully!");
      }
      resetForm();
    } catch (err) {
      alert(`Error: ${err}`);
    }
  };

  const AllIncome = incomes.map(income => {
    const { _id, IncomeHead, ...rest } = income;
    console.log(_id)
    console.log(IncomeHead.IncomeHead)

    return {
      ...rest,
      IncomeHead: IncomeHead.IncomeHead,
      Date: formatDate(income.Date), // Format date here
    };
  });

  // Handle Edit
  const handleEdit = (data) => {
    setEditing(true);
    setEditData(data);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this income ?")) {
      try {
        await dispatch(deleteIncome(id)).unwrap();
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
                    <SelectField label="Income Head" name="IncomeHead" options={IncomeHeadoptions} />
                    <NumberInput label="Invoice Number" name="InvoiceNumber"/>
                    <InputField label="Name" name="Name" />
                    <DateField label="Date"  name="Date"/>
                    <NumberInput label="Amount" name="Amount" />
                    <Upload label="Document" name="Document"/>
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
            data={AllIncome}
            fields={[
              { key: "Name", label: "Name" },
              { key: "InvoiceNumber", label: "InvoiceNumber" },
              { key: "Date", label: "Date" },
              { key: "IncomeHead", label: "IncomeHead" },
              { key: "Amount", label: "Amount" },
            ]}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AddIncome; 
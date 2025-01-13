import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { Formik, Form } from "formik";
import { InputField } from "../../components/FormElements/Fields";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
 // Updated Slice Path
import DataViewTable from "../../components/FormElements/DataViewTable";
import { createDepartment, deleteDepartment, fetchDepartments, updateDepartment } from "../../Redux/Reducer/DepartmentSlice";

// Validation Schema
const validationSchema = Yup.object().shape({
  Name: Yup.string().required("Department name is required"),
});

const Department = () => {
  const dispatch = useDispatch();
  const { data: departments = [], loading, error } = useSelector(
    (state) => state.department
  );

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch all designations on component mount
  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  // Handle Form Submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (editing) {
        await dispatch(
          updateDepartment({ id: editData._id, designation: values })
        ).unwrap();
        alert("Department updated successfully!");
        setEditing(false);
        setEditData(null);
      } else {
        await dispatch(createDepartment(values)).unwrap();
        alert("Department created successfully!");
      }
      resetForm();
    } catch (err) {
      alert(`Error: ${err.message || err}`);
    }
  };

  // Handle Edit
  const handleEdit = (data) => {
    setEditing(true);
    setEditData(data);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await dispatch(deleteDepartment(id)).unwrap();
        alert("Department deleted successfully!");
      } catch (err) {
        alert(`Error: ${err.message || err}`);
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
                {editing ? "Edit Department" : "Add Department"}
              </h2>
            </div>
            <Formik
              initialValues={{
                Name: editData?.Name || "",
              }}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="flex flex-col w-1/2">
                    <InputField label="Department Name" name="Name" />
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
            heading="Department List"
            data={departments}
            fields={[{ key: "Name", label: "Name" }]}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Department;

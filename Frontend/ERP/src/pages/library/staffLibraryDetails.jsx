import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { Formik, Form } from "formik";
import { SelectField } from "../../components/FormElement/FormElement";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import DataViewTable from "../../components/FormElement/DisplayDataTable";
import { CgPlayListAdd } from "react-icons/cg";
import {
  getDepartments,
  getDesignations,
  fetchStaff,
} from "../../redux/reducers/HumanResourseSlice";
import { addLibraryCardNumberStaff } from "../../redux/reducers/LibrarySlice";

const StaffLibraryDetails = () => {
  const dispatch = useDispatch();
  const { departments = [], designations = [], staffMembers = [], loading, error } = useSelector(
    (state) => state.humanResource
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [libraryCardNumber, setLibraryCardNumber] = useState("");

  useEffect(() => {
    dispatch(getDepartments());
    dispatch(getDesignations());
  }, [dispatch]);

  const staffSchema = Yup.object().shape({
    Department: Yup.string(),
    Designation: Yup.string(),
    roles: Yup.array().of(Yup.string()).nullable(),
  });

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "sub-admin", label: "Sub-Admin" },
    { value: "faculty", label: "Faculty" },
    { value: "librarian", label: "Librarian" },
    { value: "humanResource", label: "Human Resource" },
    { value: "accountant", label: "Accountant" },
  ];

  const handleSearch = (values, { setSubmitting }) => {
    const { Department, Designation, roles } = values;
    const filters = {};

    if (roles && roles.length > 0) filters.role = roles;
    if (Department) filters.department = Department;
    if (Designation) filters.designation = Designation;

    dispatch(fetchStaff(filters))
      .finally(() => {
        setSubmitting(false);
      });
  };

  const transformedStaffMembers = Array.isArray(staffMembers) ? staffMembers.map(staff => ({
    _id: staff._id,
    StaffId: staff.StaffId,
    Name: `${staff.FirstName} ${staff.LastName}`,
    Role: staff.roles.join(', '),
    Department: staff.Department?.Name || "N/A",
    Designation: staff.Designation?.Name || "N/A",
    Email: staff.Email,
    Phone: staff.Phone,
    StaffPhoto: staff.StaffPhoto || "N/A",
  })) : [];

  const handleAddLibraryCard = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleLibraryCardSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedStaff && libraryCardNumber) {
      try {
        await dispatch(
          addLibraryCardNumberStaff({
            staffId: selectedStaff._id,
            LibraryCardNo: libraryCardNumber,
          })
        );
        setLibraryCardNumber("");
        setIsModalOpen(false);
        setSelectedStaff(null);
        alert("Library card number added successfully.");
      } catch (error) {
        console.error("Error adding library card number:", error);
        alert("Failed to add library card number. Please try again.");
      }
    } else {
      alert("Please select a staff member and enter a library card number.");
    }
  };

  return (
    <Layout>
      <div className="flex flex-auto items-start -mt-10 -ml-4 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="space-y-8 bg-slate-50 shadow-2xl sm-rounded-lg w-full">
          <div className="border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
            <h2 className="text-2xl font-semibold leading-7 text-gray-900">
              Staff Details
            </h2>
          </div>
          <Formik
            initialValues={{ Department: "", Designation: "", roles: [] }}
            validationSchema={staffSchema}
            onSubmit={handleSearch}
          >
            {({ isSubmitting }) => (
              <Form className="p-4 space-y-4">
                <div className="flex space-x-5 w-full">
                  <SelectField
                    label="Role"
                    name="roles"
                    options={roleOptions}
                    isMulti
                  />
                  <SelectField
                    label="Department"
                    name="Department"
                    options={departments.map((Department) => ({
                      value: Department._id,
                      label: Department.Name,
                    }))}
                  />
                  <SelectField
                    label="Designation"
                    name="Designation"
                    options={designations.map((Designation) => ({
                      label: Designation.Name,
                      value: Designation._id,
                    }))}
                  />
                </div>
                <div className="justify-end">
                  <button
                    type="submit"
                    className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-3 mt-3 rounded justify-end"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Searching..." : "Search"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          {loading && <div>Loading staff members...</div>}
          {error && <div>Error fetching staff members: {error}</div>}
        </div>
      </div>
      <div>
        <DataViewTable
          heading="Staff List"
          data={transformedStaffMembers}
          fields={[
            { key: "StaffId", label: "Staff ID" },
            { key: "Name", label: "Staff Name" },
            { key: "Role", label: "Role" },
            { key: "Department", label: "Department" },
            { key: "Designation", label: "Designation" },
            { key: "Email", label: "Email" },
            { key: "Phone", label: "Phone" },
          ]}
          customActions={(row) => (
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white py-1 px-2 rounded"
              onClick={() => handleAddLibraryCard(row)}
            >
              <CgPlayListAdd />
            </button>
          )}
        />
      </div>

      {/* Modal for Adding Library Card Number */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add Library Card Number</h3>
            <form onSubmit={handleLibraryCardSubmit}>
              <div className="mb-4">
                <label htmlFor="libraryCardNumber" className="block text-sm font-medium text-gray-700">
                  Library Card Number
                </label>
                <input
                  type="text"
                  id="libraryCardNumber"
                  value={libraryCardNumber}
                  onChange={(e) => setLibraryCardNumber(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded"
                >
                  Add Library Card
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default StaffLibraryDetails;

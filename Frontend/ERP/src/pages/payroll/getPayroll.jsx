import React, { useEffect, useState, useCallback } from "react";
import Layout from "../../components/Layout/Layout";
import { Formik, Form } from "formik";
import { SelectField } from "../../components/FormElement/FormElement";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaff } from "../../redux/reducers/HumanResourseSlice";
import DataViewTable from "../../components/FormElement/DisplayDataTable";
import { fetchPayroll } from "../../redux/reducers/payrollSlice";
import PaymentModal from "./paymentModel";
import { fetchPaymentStatus } from "../../redux/reducers/PaymentSlice";

const monthOptions = [
  { value: "January", label: "January" },
  { value: "February", label: "February" },
  { value: "March", label: "March" },
  { value: "April", label: "April" },
  { value: "May", label: "May" },
  { value: "June", label: "June" },
  { value: "July", label: "July" },
  { value: "August", label: "August" },
  { value: "September", label: "September" },
  { value: "October", label: "October" },
  { value: "November", label: "November" },
  { value: "December", label: "December" },
];

const yearOptions = [
  { value: "2020", label: "2020" },
  { value: "2021", label: "2021" },
  { value: "2022", label: "2022" },
  { value: "2023", label: "2023" },
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
];

const roleOptions = [
  { value: "admin", label: "admin" },
  { value: "sub-admin", label: "sub-admin" },
  { value: "faculty", label: "faculty" },
  { value: "librarian", label: "librarian" },
  { value: "humanResource", label: "humanResource" },
  { value: "accountant", label: "accountant" },
];

const GetPayroll = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [combinedStaff, setCombinedStaff] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  
  const { staffMembers, loading: staffLoading, error: staffError } = useSelector(
    (state) => state.humanResource
  );
  const {
    payrolls = [],
    loading: payrollLoading,
    error: payrollError,
  } = useSelector((state) => state.payroll);

  const { payments=[], loading: paymentLoading, error: paymentError } = useSelector(
    (state) => state.payments
  );

  const handleProceedToPay = async (staff) => {
    const paymentData = {
        staffId: staff._id,
        month: selectedMonth,
        year: selectedYear,
        // Include other necessary fields like paymentAmount, paymentMode, etc.
    };
    
    try {
        const response = await dispatch(proceedToPayment(paymentData)).unwrap();
        // Assuming the API returns a success message or the updated payment info
        setCurrentStaff(staff);
        setIsPaymentModalOpen(true);
    } catch (error) {
        console.error("Payment failed:", error);
        // Handle the error accordingly, maybe show a notification
    }
};

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      dispatch(fetchPayroll({ month: selectedMonth, year: selectedYear }));
      dispatch(fetchPaymentStatus({ month: selectedMonth, year: selectedYear }));
    }
  }, [dispatch, selectedMonth, selectedYear]);

  const getPayrollStatus = useCallback(
    (staffId) => {
      const normalizedMonth =
        selectedMonth.charAt(0).toUpperCase() +
        selectedMonth.slice(1).toLowerCase();
      const payroll = payrolls.find(
        (p) =>
          p.staff === staffId &&
          p.month === normalizedMonth &&
          p.year === parseInt(selectedYear)
      );

      const payment = payments.find(
        (p) =>
          p.staff === staffId &&
          p.month === normalizedMonth &&
          p.year === parseInt(selectedYear)
      );

      if (payment && payment.paymentGenerated) {
        return "Paid";
      } else {
        return payroll ? payroll.payrollGenerated : false;
      }
    },
    [payrolls, payments, selectedMonth, selectedYear]
  );

  const renderStatus = (status) => {
    switch (status) {
      case "Paid":
        return (
          <span className="px-2 py-1 rounded text-white bg-blue-800 border border-blue-600">
            Paid
          </span>
        );
      case true:
        return (
          <span className="px-2 py-1 rounded text-white bg-green-500 border border-green-700">
            Generated
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded text-white bg-red-900 border border-red-700">
            Not Generated
          </span>
        );
    }
  };

  useEffect(() => {
    if (staffMembers) {
      const updatedStaff = staffMembers.map((staff) => {
        const payrollGenerated = getPayrollStatus(staff._id);
        return {
          ...staff,
          Name: `${staff.FirstName} ${staff.LastName}`,
          Department: staff.Department?.Name || "N/A",
          Designation: staff.Designation?.Name || "N/A",
          Role: staff.roles.join(", "),
          Status: payrollGenerated,
        };
      });
      setCombinedStaff(updatedStaff);
    }
  }, [getPayrollStatus, payrolls, staffMembers, selectedMonth, selectedYear]);

  const handleGeneratePayroll = (staff) => {
    if (selectedMonth && selectedYear && staff._id) {
      navigate(
        `/dashboard/payrollForm?month=${selectedMonth}&year=${selectedYear}&staffId=${staff._id}`
      );
    } else {
      console.log("Missing required parameters");
    }
  };

  const handleProceedToPay = (staff) => {
    setCurrentStaff(staff);
    setIsPaymentModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPaymentModalOpen(false);
    setCurrentStaff(null);
  };

  return (
    <Layout>
      <div className="flex flex-auto items-start -mt-10 -ml-4 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="space-y-8 bg-slate-50 shadow-2xl sm-rounded-lg w-full">
          <div className="border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
            <h2 className="text-2xl font-semibold leading-7 text-gray-900">
              Select Criteria
            </h2>
          </div>
          <Formik
            initialValues={{ roles: "", month: "", year: "" }}
            validationSchema={Yup.object({
              roles: Yup.string(),
              month: Yup.string().required("Month is required"),
              year: Yup.string().required("Year is required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
              setSelectedMonth(values.month);
              setSelectedYear(values.year);

              const filters = {};
              if (values.roles) filters.role = values.roles;
              if (values.month) filters.month = values.month;
              if (values.year) filters.year = values.year;

              dispatch(fetchStaff(filters));
              dispatch(fetchPayroll(filters));
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="p-4 space-y-4">
                <div className="flex space-x-5 w-full">
                  <SelectField
                    label="Role"
                    name="roles"
                    options={roleOptions}
                  />
                  <SelectField
                    label="Month"
                    name="month"
                    options={monthOptions}
                  />
                  <SelectField label="Year" name="year" options={yearOptions} />
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
        </div>
      </div>
      <div>
        {payrollLoading ? (
          <div>Loading...</div>
        ) : payrollError ? (
          <div className="text-red-500">Error: {typeof payrollError === "object" ? JSON.stringify(payrollError, null, 2) : payrollError}</div>
        ) : (
          <DataViewTable
            heading="Staff List"
            data={combinedStaff}
            fields={[
              { key: "StaffId", label: "Staff ID" },
              { key: "Name", label: "Name" },
              { key: "Role", label: "Role" },
              { key: "Department", label: "Department" },
              { key: "Designation", label: "Designation" },
              { key: "Phone", label: "Mobile Number" },
              {
                key: "Status",
                label: "Status",
                render: (row) => renderStatus(row.Status),
              },
            ]}
            customActions={[
              {
                name: "Generate Payroll",
                callback: handleGeneratePayroll,
                showCondition: (row) =>
                  row.Status !== true && row.Status !== "Paid",
              },
              {
                name: "Proceed to Pay",
                callback: handleProceedToPay,
                showCondition: (row) => row.Status === true,
              },
            ]}
          />
        )}
      </div>
      {isPaymentModalOpen && currentStaff && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={handleCloseModal}
          staff={currentStaff}
          month={selectedMonth}
          year={selectedYear}
        />
      )}
    </Layout>
  );
};

export default GetPayroll;

import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { proceedToPayment } from "../../redux/reducers/PaymentSlice";
import { fetchPayrollByStaff } from "../../redux/reducers/payrollSlice";

const PaymentModal = ({ staff, month, year, onClose }) => {
    const dispatch = useDispatch();
    const [paymentAmount, setPaymentAmount] = useState(0);

    const { payrollByStaff = [], loading: payrollLoading, error: payrollError } = useSelector(
        (state) => state.payroll
    );

    useEffect(() => {
        if (staff && staff.staffId && month && year) {
            console.log("Fetching payroll for staff:", staff.staffId); // Debugging line
            dispatch(fetchPayrollByStaff({ month, year, staffId: staff.staffId }))
                .then((result) => {
                    console.log("Fetch Payroll By Staff Result:", result); // Debugging line
                    if (Array.isArray(result.payload)) {
                        const payroll = result.payload.find(
                            (p) =>
                                p.staff.toString() === staff.staffId &&
                                p.month === month &&
                                p.year === parseInt(year, 10)
                        );
                        if (payroll) {
                            setPaymentAmount(payroll.payrollSummary.netSalary);
                        } else {
                            console.error("Payroll not found for the provided criteria.");
                        }
                    } else {
                        console.error("Unexpected payload format:", result.payload);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching payroll:", error);
                });
        }
    }, [dispatch, staff, month, year]);

    const handlePaymentSubmit = (values, { setSubmitting,resetForm }) => {
        if (!staff || !staff.StaffId) {
            console.error("Staff is not provided or staffId is missing");
            console.log(staff)
            return;
        }
        
        const paymentData = {
            staffId: staff._id, // Correct reference
            month,
            year,
            paymentAmount,
            paymentMode: values.method,
            paymentDate: new Date(),
            note: values.details,
        };
    
        console.log(paymentData)

        dispatch(proceedToPayment(paymentData))
            .then((result) => {
                setSubmitting(false);
                if (result.meta.requestStatus === "fulfilled") {
                    onClose();
                    resetForm();
                }
            });

        alert("Payment created successfully")
    };

    
    if (!staff) {
        return null; // Or return a loading spinner, etc.
    }

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Proceed to Payment</h2>

                <Formik
                    initialValues={{ method: "", details: "" }}
                    validationSchema={Yup.object({
                        method: Yup.string().required("Payment method is required"),
                        details: Yup.string(),
                    })}
                    onSubmit={handlePaymentSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <div>
                                    <label htmlFor="staffId" className="block text-sm font-medium text-gray-700">
                                        Staff ID
                                    </label>
                                    <Field
                                        name="staffId"
                                        type="text"
                                        value={staff.StaffId}
                                        readOnly
                                        className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                                        Month
                                    </label>
                                    <Field
                                        name="month"
                                        type="text"
                                        value={month}
                                        readOnly
                                        className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                                        Year
                                    </label>
                                    <Field
                                        name="year"
                                        type="text"
                                        value={year}
                                        readOnly
                                        className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                        Amount
                                    </label>
                                    <Field
                                        name="amount"
                                        type="number"
                                        value={paymentAmount}
                                        readOnly
                                        className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="method" className="block text-sm font-medium text-gray-700">
                                        Payment Method
                                    </label>
                                    <Field
                                        name="method"
                                        as="select"
                                        className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md"
                                    >
                                        <option value="">Select method</option>
                                        <option value="check">Check</option>
                                        <option value="cash">Cash</option>
                                        <option value="transfer to bank">Transfer to Bank</option>
                                    </Field>
                                </div>
                                <div>
                                    <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                                        Details
                                    </label>
                                    <Field
                                        name="details"
                                        as="textarea"
                                        className="mt-1 p-2 block w-full shadow-sm border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Processing..." : "Submit Payment"}
                                </button>
                                <button
                                    type="button"
                                    className="ml-4 bg-gray-300 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>

            </div>
        </div>
    );
};

export default PaymentModal;
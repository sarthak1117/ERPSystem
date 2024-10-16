import React, { useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import Layout from '../../components/Layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff } from '../../redux/reducers/HumanResourseSlice';

const PayrollForm = () => {
    const dispatch = useDispatch();
    const { departments = [], designations = [], staffMembers = [], loading, error } = useSelector(
        (state) => state.humanResource
      );

      useEffect(() => {
        dispatch(fetchStaff());
      }, [dispatch]);

  const initialValues = {
    staffDetails: {
      name: '',
      phone: '',
      email: '',
      department: '',
      designation: '',
    },
    earnings: [{ type: '', amount: '' }],
    deductions: [{ type: '', amount: '' }],
    payrollSummary: {
      basicSalary: 0,
      grossSalary: 0,
      tax: 0,
      netSalary: 0,
    },
  };

  const validationSchema = Yup.object({
    staffDetails: Yup.object({
      name: Yup.string().required('Required'),
      phone: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
    }),
    earnings: Yup.array().of(
      Yup.object({
        type: Yup.string().required('Required'),
        amount: Yup.number().required('Required').positive('Must be positive'),
      })
    ),
    deductions: Yup.array().of(
      Yup.object({
        type: Yup.string().required('Required'),
        amount: Yup.number().required('Required').positive('Must be positive'),
      })
    ),
    payrollSummary: Yup.object({
      basicSalary: Yup.number().required('Required').positive('Must be positive'),
      tax: Yup.number().required('Required').positive('Must be positive'),
    }),
  });

  const handleSubmit = (values) => {
    // Perform calculations or send data to the backend
    console.log(values);
  };

  return (
    <Layout>

   
    <div className="container mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Payroll Form</h1> */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Staff Details</h2>
                <div className=' flex'>
                <ProfileInfo
                  fields={[
                    { label: "Name", value: staffMembers.Phone },
                    { label: "StaffId", value: staffMembers.EmergencyContactNumber },
                    { label: "Mobile Number", value: staffMembers.Email },
                    { label: "EPF NO", value: staffMembers.Gender },
                    { label: "Role", value: staffMembers.roles},
                    { label: "Designation", value: staffMembers.Designation },
                    { label: "Department", value: staffMembers.Department },                    
                  ]}
                />

                </div>
                </div>
              <div>

                
                <h2 className="text-xl font-semibold mb-2">Earnings</h2>
                <FieldArray name="earnings">
                  {({ push, remove }) => (
                    <>
                      {values.earnings.map((_, index) => (
                        <div key={index} className="mb-2 flex items-center">
                          <Field name={earnings.${index}.type} className="w-full p-2 border rounded" placeholder="Type" />
                          <Field name={earnings.${index}.amount} type="number" className="w-full p-2 border rounded ml-2" placeholder="Amount" />
                          <button type="button" className="ml-2 text-red-500" onClick={() => remove(index)}>x</button>
                        </div>
                      ))}
                      <button type="button" className="text-blue-500" onClick={() => push({ type: '', amount: '' })}>Add Earning</button>
                    </>
                  )}
                </FieldArray>
                <h2 className="text-xl font-semibold mb-2 mt-4">Deductions</h2>
                <FieldArray name="deductions">
                  {({ push, remove }) => (
                    <>
                      {values.deductions.map((_, index) => (
                        <div key={index} className="mb-2 flex items-center">
                          <Field name={deductions.${index}.type} className="w-full p-2 border rounded" placeholder="Type" />
                          <Field name={deductions.${index}.amount} type="number" className="w-full p-2 border rounded ml-2" placeholder="Amount" />
                          <button type="button" className="ml-2 text-red-500" onClick={() => remove(index)}>x</button>
                        </div>
                      ))}
                      <button type="button" className="text-blue-500" onClick={() => push({ type: '', amount: '' })}>Add Deduction</button>
                    </>
                  )}
                </FieldArray>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Payroll Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block mb-1" htmlFor="basicSalary">Basic Salary</label>
                  <Field name="payrollSummary.basicSalary" type="number" className="w-full p-2 border rounded" />
                  <ErrorMessage name="payrollSummary.basicSalary" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-4">
                  <label className="block mb-1" htmlFor="tax">Tax</label>
                  <Field name="payrollSummary.tax" type="number" className="w-full p-2 border rounded" />
                  <ErrorMessage name="payrollSummary.tax" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-1" htmlFor="grossSalary">Gross Salary</label>
                <Field name="payrollSummary.grossSalary" type="number" className="w-full p-2 border rounded" disabled />
              </div>
              <div className="mb-4">
                <label className="block mb-1" htmlFor="netSalary">Net Salary</label>
                <Field name="payrollSummary.netSalary" type="number" className="w-full p-2 border rounded" disabled />
              </div>
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Save</button>
          </Form>
        )}
      </Formik>
    </div>
    </Layout>
  );
};


const ProfileInfo = ({ title, fields }) => (
    <div className="border-b border-gray-400 pb-8 ml-3 mt-2 float-left">
      <h2 className="text-base font-semibold leading-7 text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1  sm:grid-cols-6 box-border h-40 w-120 p-4 border-4">
        {fields.map((field, index) => (
          <div key={index} className="sm:col-span-3 flex rounded p-4 ml-3 mr-3">
            <label className="text-sm font-medium leading-6 text-gray-500 ">
              {field.label}
            </label>
            <div className="flex items-center ml-5">
              <span>{field.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

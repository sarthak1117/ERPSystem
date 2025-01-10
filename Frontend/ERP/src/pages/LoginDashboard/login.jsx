import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginUser } from "../../Redux/Reducer/AuthenticationSlice";

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username or email is required")
      .min(3, "Must be at least 3 characters"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Must be at least 6 characters"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(loginUser(values));
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
    <div className="bg-white rounded-xl shadow-lg flex w-full max-w-5xl">
      {/* Left Side: Image and Text Content */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-tr from-purple-500 to-blue-500 items-center justify-center rounded-l-xl flex-col text-center p-6">
        <img
          src="image.png"
          alt="School ERP"
          className="max-w-full rounded-lg "
        />
        {/* <h2 className="text-2xl font-bold text-white mb-2">
          School ERP System
        </h2>
        <p className="text-white text-sm">
          Simplify your school's administrative tasks with our powerful ERP
          solution. Manage students, staff, and academic workflows seamlessly.
        </p> */}
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full md:w-1/2 p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Admin Portal
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg 
                  ${isSubmitting ? "opacity-50" : "hover:bg-blue-600"}
                `}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
        <p className="text-center text-sm text-gray-600 mt-6">
          Forgot your password?{" "}
          <a href="/reset" className="text-purple-500 hover:underline">
            Reset it here
          </a>
        </p>
      </div>
    </div>
  </div>
  );
};

export default Login;

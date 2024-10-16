import Layout from "../../components/Layout/Layout";
import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import { Upload } from "../../components/FormElement/FormElement";
import { useDispatch, useSelector } from "react-redux";
import { importBooks } from "../../redux/reducers/LibrarySlice";
import { getDepartments, getDesignations } from "../../redux/reducers/HumanResourseSlice";

const ImportBook = () => {
  const dispatch = useDispatch();
  const { loading: bookLoading, error: bookError, success: bookSuccess } = useSelector((state) => state.library);

  useEffect(() => {
    dispatch(getDepartments());
    dispatch(getDesignations());
  }, [dispatch]);

  const handleSubmit = (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("file", values.StudentData);

    dispatch(importBooks(formData)).finally(() => {
      setSubmitting(false);
    });
  };

  return (
    <Layout>
      <div className="flex flex-auto items-start -mt-10 -ml-4 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div className="space-y-8 bg-slate-50 shadow-2xl sm-rounded-lg w-full">
          <div className="border-b border-gray-400 pb-8 m-3 flex-cols items-center ">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold items-end leading-7 text-gray-900">
                Select Criteria
              </h2>
              <a
                href="/sample-import-file.csv" // Update this path to the correct location of your sample file
                download
                className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-2 rounded justify-center"
              >
                Download Sample File
              </a>
            </div>
            <div className="mt-5">
              <p>
                1. Your CSV data should be in the format below. The first line
                of your CSV file should be the column headers as in the table
                example. Also make sure that your file is UTF-8 to avoid
                unnecessary encoding problems.
                <br />
                2. If the column you are trying to import is date make sure that
                is formatted in format Y-m-d (2018-06-06).
              </p>
            </div>
          </div>
          <Formik
            initialValues={{ StudentData: null }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="p-4 space-y-4">
                <div className="flex-col space-x-5 w-1/2">
                  <div>
                    <Upload
                      label="Select a file"
                      name="StudentData"
                      onChange={(e) =>
                        setFieldValue("StudentData", e.target.files[0])
                      }
                    />
                  </div>
                </div>

                <div className="justify-end">
                  <button
                    type="submit"
                    className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-3 mt-3 rounded justify-end"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Uploading..." : "Upload"}
                  </button>
                </div>
                {bookLoading && <div>Uploading books...</div>}
                {bookError && <div>Error uploading books: {bookError}</div>}
                {bookSuccess && <div>Books imported successfully!</div>}
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div></div>
    </Layout>
  );
};

export default ImportBook;

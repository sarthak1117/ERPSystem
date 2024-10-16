import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { Formik, Form } from "formik";
import { DateField, InputField } from "../../components/FormElement/FormElement";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchIssuedBooks, issueBook, returnBook } from "../../redux/reducers/LibrarySlice";
import { useNavigate } from "react-router-dom";
import DataViewTable from "../../components/FormElement/DisplayDataTable";
import Modal from "../../components/Modal/Modal";

// Validation schema using Yup for issuing books
const validationSchema = Yup.object().shape({
  BookNumber: Yup.string().required("Book number is required"),
  LibraryCardNo: Yup.string().required("Library card number is required"),
  BorrowDate: Yup.date().required("Borrow date is required"),
  IssueBy: Yup.string(),
  ReturnId: Yup.string(),
  MemberType: Yup.string().required("Member type is required"),
});

const IssueBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const { issuedBooks = [], loading, error } = useSelector((state) => state.library);

  useEffect(() => {
    dispatch(fetchIssuedBooks());
  }, [dispatch]);

  const handleReturnBookClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleReturnSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(returnBook(values)).unwrap();
      alert("Book returned successfully!");
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      alert("An error occurred while returning the book.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formattedBooks = issuedBooks.map((issuedBook) => ({
    ...issuedBook,
    _id: issuedBook._id,
    BookTitle: issuedBook.Book.BookTitle,
    BookNumber: issuedBook.Book.BookNumber,
    BorrowDate: formatDate(issuedBook.BorrowDate),
    ReturnDate: issuedBook.ReturnDate ? formatDate(issuedBook.ReturnDate) : null,
    Returned: issuedBook.Returned,
    Name: issuedBook.UserDetails.FirstName,
    UserType: issuedBook.UserType,
    MemberType: issuedBook.MemberType,
    ReturnId: issuedBook.ReturnId,
    IssuedTo: issuedBook.IssuedTo,
  }));

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
            initialValues={{
              BookNumber: "",
              LibraryCardNo: "",
              BorrowDate: "",
              IssueBy: "",
              ReturnId: "",
              MemberType: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-auto items-start w-full">
                <div className="space-y-8 bg-slate-50 shadow-2xl rounded-lg w-full">
                  <div className="border-b border-gray-400 pb-8 m-3 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                      Issue Book
                    </h2>
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => navigate("/importBooks")}
                        className="hover:bg-slate-400 bg-cyan-800 text-white py-2 px-2 rounded"
                      >
                        Return Book
                      </button>
                    </div>
                  </div>
                  <div className="ml-3 mr-3 mt-10 mb-3 grid grid-cols-3 gap-x-6 gap-y-5 sm:grid-cols-12">
                    <InputField label="Book Number" name="BookNumber" />
                    <InputField label="Library Card Number" name="LibraryCardNo" />
                    <DateField
                      label="Borrow Date"
                      name="BorrowDate"
                      placeholder="Select Date"
                    />
                    <InputField label="Issue By" name="IssueBy" />
                    <InputField label="Return ID" name="ReturnId" />
                    <InputField label="Member Type" name="MemberType" />
                  </div>
                  <div className="ml-3 mr-3 mt-10 mb-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-cyan-800 hover:bg-slate-400 text-white py-2 px-4 rounded"
                    >
                      Submit
                    </button>
                  </div>
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
          heading="Issued Book"
          data={formattedBooks} // Use formatted books data
          fields={[
            { key: "BookTitle", label: "Book Title" },
            { key: "BookNumber", label: "Book Number" },
            { key: "BorrowDate", label: "Borrow Date" },
            { key: "LibraryCardNo", label: "Library Card No" },
            { key: "IssueBy", label: "Issue By" },
            { key: "Name", label: "Name" },
            { key: "MemberType", label: "Member Type" },
          ]}
          customActions={(row) => {
            if (row.Returned === false) {
              return (
                <button
                  className="bg-blue-600 hover:bg-blue-500 text-white py-1 px-2 rounded"
                  onClick={() => handleReturnBookClick(row)}
                >
                  Not Returned
                </button>
              );
            } else if (row.Returned === true) {
              return (
                <button className="bg-green-600 hover:bg-green-500 text-white py-1 px-2 rounded">
                  Returned
                </button>
              );
            }
          }}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedBook && (
          <Formik
            initialValues={{
              BookNumber: selectedBook.BookNumber,
              LibraryCardNo: selectedBook.LibraryCardNo,
              ReturnId: selectedBook.ReturnId,
            }}
            onSubmit={handleReturnSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  label="Book Number"
                  name="BookNumber"
                  disabled={true}
                />
                <InputField
                  label="Library Card Number"
                  name="LibraryCardNo"
                  disabled={true}
                />
                <InputField
                  label="Return ID"
                  name="ReturnId"
                  disabled={true}
                />
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-cyan-800 hover:bg-slate-400 text-white py-2 px-4 rounded"
                  >
                    Return Book
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </Modal>
    </Layout>
  );
};

export default IssueBook;

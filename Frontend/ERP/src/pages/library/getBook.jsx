import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Layout from "../../components/Layout/Layout";
import DataViewTable from "../../components/FormElement/DisplayDataTable";
import { fetchBooks } from "../../redux/reducers/LibrarySlice";

const GetBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const { books = [], loading, error } = useSelector((state) => state.library);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  // Custom function to format the date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format the books data with formatted PostDate
  const formattedBooks = books.map((book) => ({
    ...book,
    PostDate: formatDate(book.PostDate),
  }));

  // Handler for navigation to Add Book page
  const handleAddBook = () => {
    navigate("/addBook"); // Adjust the path based on your route configuration
  };

  return (
    <Layout>
      <div className="flex flex-auto items-start -mt-10 -ml-4 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
      </div>
      <div>
        <DataViewTable
          heading="Book List"
          button="Add Book"
          data={formattedBooks} // Use formatted books data
          fields={[
            { key: "BookTitle", label: "Book Title" },
            { key: "BookNumber", label: "Book Number" },
            { key: "ISBNNumber", label: "ISBN Number" },
            { key: "Publisher", label: "Publisher" },
            { key: "Author", label: "Author" },
            { key: "RackNumber", label: "Rack Number" },
            { key: "Quantity", label: "Quantity" },
            { key: "BookPrice", label: "Book Price" },
            { key: "PostDate", label: "Post Date" },
          ]}
          onButtonClick={handleAddBook} // Pass the handler to the DataViewTable
        />
      </div>
    </Layout>
  );
};

export default GetBook;

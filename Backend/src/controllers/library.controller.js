import { asyncHandler } from "../utils/asyncHandler ";
import { StudentInfo } from "../models/studentInfo.models";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Staff } from "../models/staff.models";
import { LibraryNumber, Library ,Book, IssuedBook} from "../models/library.models.js";
import fs from 'fs';
import path from 'path';
import csv from 'fast-csv';
import xlsx from 'xlsx';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import { uploadOnCloudinary } from "../utils/cloudinaryUtils.js"; // Import the utility function

const addBook = asyncHandler(async (req, res) => {
  const {
    BookTitle,
    BookNumber,
    ISBNNumber,
    Publisher,
    Author,
    BookPrice,
    RackNumber,
    Quantity,
    Description,
    Subject,
    PostDate,
  } = req.body;

  // Validate required fields
  if (!BookTitle || !BookNumber || !ISBNNumber || !Publisher || !Author || !BookPrice || !RackNumber || !Quantity) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Create a new book instance
  const newBook = new Book({
    BookTitle,
    BookNumber,
    ISBNNumber,
    Publisher,
    Author,
    BookPrice,
    RackNumber,
    Quantity,
    Description,
    Subject,
    PostDate,
  });

  // Save the book to the database
  await newBook.save();

  // Return a success response
  res.status(201).json(new ApiResponse(201, newBook, "Book added successfully"));
});


const importBooks = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("Please upload a file!");
        }

        const filePath = path.join(__dirname, "../../public/temp", req.file.filename);
        const fileExtension = path.extname(req.file.originalname).toLowerCase();

        let books = [];

        if (fileExtension === ".csv") {
            // Process CSV file
            fs.createReadStream(filePath)
                .pipe(csv.parse({ headers: true }))
                .on("error", (error) => {
                    throw new Error(error.message);
                })
                .on("data", (data) => {
                    books.push(data);
                })
                .on("end", async () => {
                    await processAndSaveBooks(books, filePath, res);
                });

        } else if (fileExtension === ".xlsx") {
            // Process XLSX file
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            books = xlsx.utils.sheet_to_json(sheet);

            await processAndSaveBooks(books, filePath, res);
        } else {
            fs.unlinkSync(filePath); // Remove the temporary file for unsupported file types
            return res.status(400).send({
                message: "Unsupported file type. Only CSV and Excel files are allowed.",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
            error: error.message,
        });
    }
});

// const processAndSaveBooks = async (books, filePath, res) => {
//     try {
//         // Collect BookNumbers and ISBNNumbers
//         const bookNumbers = books.map(b => b.BookNumber);
//         const isbnNumbers = books.map(b => b.ISBNNumber);

//         // Check for duplicates in the database
//         const existingBooks = await Book.find({
//             $or: [
//                 { BookNumber: { $in: bookNumbers } },
//                 { ISBNNumber: { $in: isbnNumbers } }
//             ]
//         });

//         if (existingBooks.length > 0) {
//             const duplicates = existingBooks.map(b => `BookNumber: ${b.BookNumber}, ISBNNumber: ${b.ISBNNumber}`).join(', ');
//             throw new Error(`Duplicate entries found: ${duplicates}`);
//         }

//         await Book.insertMany(books);
        
//         // Upload the file to Cloudinary
//         const cloudinaryResponse = await uploadOnCloudinary(filePath);
        
//         if (!cloudinaryResponse) {
//             return res.status(500).send({
//                 message: "Failed to upload the file to Cloudinary.",
//             });
//         }

//         // Send a success response with Cloudinary URL
//         res.status(200).send({
//             message: "Uploaded the file successfully.",
//             url: cloudinaryResponse.url,
//         });
//     } catch (error) {
//         fs.unlinkSync(filePath); // Remove the temporary file on error
//         res.status(500).send({
//             message: "Fail to import data into database!",
//             error: error.message,
//         });
//     }
// };



const issueBook = asyncHandler(async (req, res) => {
    const { 
      BookNumber, 
      LibraryCardNo, 
      BorrowDate,
      ReturnDate, 
      ReturnId, 
      IssueBy,
      MemberType 
    } = req.body;
  
    if (!BookNumber || !LibraryCardNo || !BorrowDate || !ReturnDate || !MemberType) {
      throw new ApiError("BookNumber, LibraryCardNo, BorrowDate, ReturnDate, and MemberType are required", 400);
    }
  
    // Check if the book exists by BookNumber
    const book = await Book.findOne({ BookNumber });
    if (!book) {
      throw new ApiError("Book not found", 404);
    }
  
    // Check if the book is available
    const issuedBookCount = await IssuedBook.countDocuments({
      Book: book._id,
      Returned: false,
    });
  
    if (issuedBookCount >= book.Quantity) {
      throw new ApiError("Book is not available for issuance", 400);
    }
  
    // Check if the library card belongs to a student or staff
    let libraryCard = await StudentInfo.findOne({ LibraryCardNo });
    if (!libraryCard) {
      libraryCard = await Staff.findOne({ LibraryCardNo });
    }
  
    if (!libraryCard) {
      throw new ApiError("LibraryCardNo not found", 404);
    }
  
    const user = libraryCard._id;
    const userType = libraryCard.constructor.modelName; // This will be 'StudentInfo' or 'Staff'
  
    // Issue the book
    const newIssuedBook = new IssuedBook({
      Book: book._id,
      IssuedTo: user,
      userModel: userType,
      BorrowDate: BorrowDate || Date.now(),
      ReturnDate: new Date(ReturnDate),
      ReturnId,
      MemberType, // Assuming IssueType is replaced by MemberType
    });
  
    await newIssuedBook.save();
  
    res.status(200).json({
      status: 200,
      data: { issuedBook: newIssuedBook },
      message: "Book issued successfully",
    });
  });
  
  
  const returnBook = asyncHandler(async (req, res) => {
    const { BookNumber, LibraryCardNo, ReturnId } = req.body;
  
    if (!BookNumber || !LibraryCardNo || !ReturnId) {
      throw new ApiError("BookNumber, LibraryCardNo, and ReturnId are required", 400);
    }
  
    // Find the issued book record and populate the 'Book' field
    const issuedBook = await IssuedBook.findOne({
      ReturnId,
      Returned: false,
    }).populate('Book');
  
    // Check if the issued book exists and matches the provided details
    if (!issuedBook || issuedBook.Book.BookNumber !== BookNumber) {
      throw new ApiError("No active book issuance found with the provided details", 404);
    }
  
    // Verify LibraryCardNo
    if (issuedBook.LibraryCardNo !== LibraryCardNo) {
      throw new ApiError("Library card number does not match", 400);
    }
  
    // Mark the book as returned and set the return date to now
    issuedBook.Returned = true;
    issuedBook.ActualReturnDate = Date.now();
  
    // Optionally, calculate any fines if the book is returned late
    const dueDate = new Date(issuedBook.ReturnDate);
    const currentDate = new Date();
    if (currentDate > dueDate) {
      const daysLate = Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24));
      const finePerDay = 5; // Example fine amount per day
      issuedBook.FineAmount = daysLate * finePerDay;
    }
  
    await issuedBook.save();
  
    res.status(200).json(new ApiResponse(200, issuedBook, "Book returned successfully"));
  });
  

  const getIssueBooks = asyncHandler(async (req, res) => {
    try {
      // Fetch issued books where Returned is false
      const issuedBooks = await IssuedBook.find({ Returned: false })
        .populate('Book', 'BookTitle BookNumber')  // Populate book details
        .exec();
  
      if (!issuedBooks || issuedBooks.length === 0) {
        throw new ApiError("No issued books with returned status false found", 404);
      }
  
      // Populate user details based on LibraryCardNo
      const populatedIssuedBooks = await Promise.all(
        issuedBooks.map(async (issuedBook) => {
          let userDetails;
          let userType;
  
          // Try to find the user in StudentInfo first
          const studentInfo = await StudentInfo.findOne({ LibraryCardNo: issuedBook.LibraryCardNo });
          if (studentInfo) {
            userDetails = {
              FirstName: studentInfo.FirstName,
      
             
            };
            userType = 'StudentInfo';
          } else {
            // If not found in StudentInfo, check Staff
            const staffInfo = await Staff.findOne({ LibraryCardNo: issuedBook.LibraryCardNo });
            if (staffInfo) {
              userDetails = {
                FirstName: staffInfo.FirstName,
               
              };
              userType = 'Staff';
            }
          }
  
          // Return the issued book with populated user details
          return {
            ...issuedBook.toObject(),
            UserDetails: userDetails,
            UserType: userType,
          };
        })
      );
  
      // Return the issued books with populated user details
      res.status(200).json(new ApiResponse(200, populatedIssuedBooks, "Issued books with returned status false retrieved successfully"));
    } catch (error) {
      // Handle any errors that occur during the process
      res.status(500).json(new ApiResponse(500, null, "Failed to retrieve issued books"));
    }
  });
  
  const processAndSaveBooks = async (books, filePath, res, req) => {
    try {
      // Collect BookNumbers and ISBNNumbers
      const bookNumbers = books.map(b => b.BookNumber);
      const isbnNumbers = books.map(b => b.ISBNNumber);
  
      // Check for duplicates in the database
      const existingBooks = await Book.find({
        $or: [
          { BookNumber: { $in: bookNumbers } },
          { ISBNNumber: { $in: isbnNumbers } }
        ]
      });
  
      if (existingBooks.length > 0) {
        const duplicates = existingBooks.map(b => `BookNumber: ${b.BookNumber}, ISBNNumber: ${b.ISBNNumber}`).join(', ');
        throw new Error(`Duplicate entries found: ${duplicates}`);
      }
  
      await Book.insertMany(books);
      // Remove the temporary file
      fs.unlinkSync(filePath); // Removing the temp file after a successful operation
  
      res.status(200).send({
        message: "Uploaded the file successfully: " + req.file.originalname,
      });
    } catch (error) {
      fs.unlinkSync(filePath); // Remove the temporary file on error
      res.status(500).send({
        message: "Fail to import data into database!",
        error: error.message,
      });
    }
  };

  const getBooks = asyncHandler(async (req, res) => {
    try {
      // Fetch all books from the database
      const books = await Book.find();
  
      // Return the books with a success response
      res.status(200).json(new ApiResponse(200, books, "Books retrieved successfully"));
    } catch (error) {
      res.status(500).json(new ApiResponse(500, null, "Failed to retrieve books"));
    }
  });


  const addLibraryCardNumberStaff = asyncHandler(async (req, res) => {
    const { staffId, LibraryCardNo } = req.body;
  
    if (!staffId || !LibraryCardNo) {
      throw new ApiError(400, "StaffId and LibraryCardNo are required");
    }
  
    // Find the staff by ID
    const staff = await Staff.findById(staffId);
  
    if (!staff) {
      throw new ApiError(404, "Staff not found");
    }
  
    // Check if the LibraryCardNo is already assigned to another staff
    const existingStaffCard = await Staff.findOne({ LibraryCardNo, _id: { $ne: staffId } });
    if (existingStaffCard) {
      throw new ApiError(409, "Library card number is already assigned to another staff");
    }
  
    // Check if the LibraryCardNo is already assigned to a student
    const existingStudentCard = await StudentInfo.findOne({ LibraryCardNo });
    if (existingStudentCard) {
      throw new ApiError(409, "Library card number is already assigned to another student");
    }
  
    // Update the staff's LibraryCardNo
    staff.LibraryCardNo = LibraryCardNo;
    await staff.save();
  
    res.status(200).json(new ApiResponse(200, staff, "Library card number added successfully"));
  });
  
  const addLibraryCardNumberStudent = asyncHandler(async (req, res) => {
    const { studentId, LibraryCardNo } = req.body;
  
    // Validate input
    if (!studentId || !LibraryCardNo) {
      throw new ApiError(400, "StudentId and LibraryCardNo are required");
    }
  
    // Find the student by ID
    const student = await StudentInfo.findOne({ _id: studentId });
  
    // Check if student exists
    if (!student) {
      throw new ApiError(404, "Student not found");
    }
  
    // Optional: Check if the LibraryCardNo is already assigned to another student
    const existingCard = await StudentInfo.findOne({ LibraryCardNo, _id: { $ne: studentId } });
    if (existingCard) {
      throw new ApiError(409, "Library card number is already assigned to another student");
    }
  
    // Update the student's library card number
    student.LibraryCardNo = LibraryCardNo;
    await student.save();
  
    // Respond with success
    res.status(200).json(new ApiResponse(200, student, "Library card number added successfully"));
  });
  


  export {addLibraryCardNumberStaff,addLibraryCardNumberStudent,addBook,issueBook, getBooks,getIssueBooks,returnBook,importBooks}
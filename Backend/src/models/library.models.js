const createBook = asyncHandler(async (req, res) => {
    const {
      BookTitle,
      BookNumber,
      ISBNNumber,
      Publisher,
      Author,
      RackNumber,
      Quantity,
      BookPrice,
      PostDate, // Ensure this field is extracted from the request body
    } = req.body;
  
    if (!BookTitle || !BookNumber || !ISBNNumber || !Publisher || !Author || !RackNumber || !Quantity || !BookPrice || !PostDate) {
      res.status(400);
      throw new Error('Please fill in all fields');
    }
  
    // Create a new book
    const book = await Book.create({
      BookTitle,
      BookNumber,
      ISBNNumber,
      Publisher,
      Author,
      RackNumber,
      Quantity,
      BookPrice,
      PostDate, // Make sure this is correctly used in your model
    });
  
    res.status(201).json(book);
  });
  
  const issuedBookSchema = new mongoose.Schema({
    BookNumber: { type: String, required: true },
    ReturnId: { type: String, required: true },
    Returned: { type: Boolean, default: false },
    ActualReturnDate: { type: Date },
    ReturnDate: { type: Date },
    FineAmount: { type: Number },
    Book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
  });

  const issuedBookSchema = new mongoose.Schema({
    Book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    IssuedTo: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'userModel',
      required: true,
    },
    userModel: {
      type: String,
      required: true,
      enum: ['StudentInfo', 'Staff']
    },
    BorrowDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    ReturnDate: {
      type: Date,
      required: true,
    },
    ReturnId: {
      type: String,
    },
  
    Submission: {
      type: String,
      enum: ['Late', 'Ontime'],
    },
  
    LateFine: {
      type: Number,
    },
  
    IssueType: {
      type: String,
      enum: ['CourseDuration', 'Personal'],
      required: true,
    },
    Returned: {
      type: Boolean,
      default: false,
    },
  });

  const bookSchema = new mongoose.Schema({
    BookTitle: { type: String, required: true },
    BookNumber: { type: String, required: true },
    ISBNNumber: { type: String, required: true },
    Publisher: { type: String, required: true },
    Author: { type: String, required: true },
    RackNumber: { type: String, required: true },
    Quantity: { type: Number, required: true },
    BookPrice: { type: Number, required: true },
    PostDate: { type: Date, required: true }, // Ensure this field is defined
  });
  
  const Book = mongoose.model('Book', bookSchema);
  
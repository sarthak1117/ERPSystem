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
    Subject:{type: Number, required: true},
    PostDate: { type: Date, required: true }, // Ensure this field is defined
  });
  
  const Book = mongoose.model('Book', bookSchema);
  
  const libraryNumberSchema = new mongoose.Schema({
    LibraryCardNo: {
      type: String,
      required: true,
      unique: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentInfo"
    },
    staff: {  // Note: Changed 'Staff' to 'staff' for consistency
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff"
    }
  });
  
  
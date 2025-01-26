import mongoose, { Schema } from 'mongoose';

const batchSchema = new Schema({
    name: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true } // Reference to Course
  });
  
  export const Batch = mongoose.model('Batch', batchSchema);

const courseSchema = new Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  admissionCharge: { type: Number, required: true },
  courseCharge: { type: Number, required: true }
});

export const Course = mongoose.model('Course', courseSchema);


const studentInfoSchema = new Schema({
    admissionNo: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, unique: true },
    mobileNumber: { type: String },
    batch: { type: Schema.Types.ObjectId, ref: 'Batch', required: true }, // Reference to Batch
    disableStudent: { type: Boolean, default: false },
    disableReason: { type: String, required: function() { return this.disableStudent; } },
    admissionDate: { type: Date },
    studentPhoto: { type: String },
    fatherPhoto: { type: String },
    studentHouse: { type: String },
    asOnDate: { type: Date },
    fatherName: { type: String },
    guardianRelation: { type: String },
    guardianOccupation: { type: String },
    guardianAddress: { type: String },
    address: {
      current: { type: String },
      permanent: { type: String }
    },
    notes: { type: String }
  });
  
  export const StudentInfo = mongoose.model('StudentInfo', studentInfoSchema);
  


  import mongoose, { Schema } from "mongoose";

// Define the schema for Course
const courseSchema = new Schema({
  name: { type: String, required: true },
  duration: {
    type: Number,
    required: true,
  },
  admissionCharge: {
    type: Number,
    required: true,
  },
  courseCharge: {
    type: Number,
    required: true,
  },

  batches: [{ type: Schema.Types.ObjectId, ref: "Batch" }],

  // Course name or identifier
  // Array of Batch documents
});

const batchSchema = new Schema({
  name: { type: String, required: true }, // Batch name or identifier

  // courseId :{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref:'Course',
  // }

  // Array of StudentInfo documents
});

const studentInfoSchema = new Schema({
  AdmissionNo: {
    type: String,
    required: true,
    unique: true,
  },
  Course: {
    type: String,
    required: true,
  },
  Batch: {
    type: String,
    required: true,
  },
  FirstName: {
    type: String,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
  },
  DateOfBirth: {
    type: Date,
    required: true,
  },
  LastName: String,
  RollNumber: String,
  Category: {
    type: String,
    enum: ["General", "SC", "ST", "OBC"],
  },

  MobileNumber: String,
  Email: {
    type: String,
    unique: true,
  },
  disableStudent: {
    type: Boolean,
    default: false,
  },

  disableReason: {
    type: String,
    required: function () {
      return this.disableStudent;
    },
  },
  AdmissionDate: Date,
  StudentPhoto: String,
  FatherPhoto: String,
  StudentHouse: {
    type: String,
  },
  AsOnDate: Date,
  FatherName: String,
  GuradianRelation: String,
  GuardianOccupation: String,
  GuardianAddress: String,
  address: {
    current: {
      type: String,
    },
    permanent: {
      type: String,
    },
  },
  Notes: String,

  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch", // Reference to the Batch model
  },

  LibraryCardNo: {
    type: String,
    required: false, // Adjust based on whether it's required
    unique: true // Ensure it is unique if necessary
  },
});

export const Course = mongoose.model("Course", courseSchema);
export const Batch = mongoose.model("Batch", batchSchema);

export const StudentInfo = mongoose.model("StudentInfo", studentInfoSchema);
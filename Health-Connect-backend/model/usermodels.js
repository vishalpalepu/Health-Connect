const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Userschema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  surname: { type: String },

  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "this email is already used "],
  },

  password: {
    type: String,
    required: [true, "password is required"],
  },
  passwordResetToken: { type: String },
  passwordResetTokenExpiry: { type: Date },
  role: {
    type: String,
  },
  address1: {
    type: String,
  },
  address2: {
    type: String,
  },
  phonenumber: {
    type: Number,
  },
  appointedTo: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Doctor",
  },
  medicalData: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalData",
    },
  ],
});

const UserModel = mongoose.model("User", Userschema);

const medicalDataSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120,
  },
  diabetesDuration: {
    type: Number,
    default: 0,
  },
  diabeticRetinopathy: {
    type: String,
    default: "false",
  },
  diabeticNephropathy: {
    type: String,
    default: "false",
  },
  smoking: {
    type: String,
    default: "false",
  },
  drinking: {
    type: String,
    default: "false",
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  bmi: {
    type: Number,
    required: true,
    min: 0,
    max: 60,
  },
  sbp: {
    type: Number,
    default: null,
  },
  dbp: {
    type: Number,
    default: null,
  },
  hbA1c: {
    type: Number,
    default: null,
  },
  fbg: {
    type: Number,
    default: null,
  },
  tg: {
    type: Number,
    default: null,
  },
  cPeptide: {
    type: Number,
    default: null,
  },
  tc: {
    type: Number,
    default: null,
  },
  hdLc: {
    type: Number,
    default: null,
  },
  ldLc: {
    type: Number,
    default: null,
  },
  insulin: {
    type: String,
    default: "false",
  },
  metformin: {
    type: String,
    default: "false",
  },
  lipidLoweringDrugs: {
    type: String,
    default: "false",
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

const UserMedicalDataModel = mongoose.model("MedicalData", medicalDataSchema);

module.exports = { UserMedicalDataModel, UserModel };

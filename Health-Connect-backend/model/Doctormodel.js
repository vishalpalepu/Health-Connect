const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Doctorschema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },

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
  address: {
    type: String,
  },
  phonenumber: {
    type: Number,
  },
  specialization: {
    type: String,
  },
  qualification: {
    type: String,
  },
  experience: {
    type: Number,
  },
  InstituteStudied: {
    type: String,
  },
  appointedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
});

const DoctorModel = mongoose.model("Doctor", Doctorschema);

module.exports = DoctorModel;

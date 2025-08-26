const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Adminschema = new Schema({
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
});

const AdminModel = mongoose.model("Admin", Adminschema);

module.exports = AdminModel;

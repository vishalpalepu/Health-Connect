const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true, // It's often a good idea to require this field
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // It's often a good idea to require this field
    },
  },
  { timestamps: true } // Automatically create createdAt and updatedAt fields
);

const chatModel = mongoose.model("Chat", ChatSchema);
module.exports = chatModel;

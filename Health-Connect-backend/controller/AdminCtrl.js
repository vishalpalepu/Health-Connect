const AdminModel = require("../model/Adminmodel.js");
const DoctorModel = require("../model/Doctormodel.js");
const ChatModel = require("../model/ChatModel.js");
const { UserModel } = require("../model/usermodels.js");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

async function HandleLoginController(req, res) {
  try {
    console.log("inside admin login");
    const alreadypresent = await AdminModel.findOne({ email: req.body.email });
    if (!alreadypresent) {
      return res
        .status(200)
        .send({ success: false, message: `User not found` });
    }

    const isMatch = await bcrypt.compare(
      req.body.password,
      alreadypresent.password
    );
    if (!isMatch) {
      return res
        .status(200)
        .send({ success: false, message: "Incorrect Password" });
    }

    const token = jwt.sign(
      { id: req.body._id, email: req.body.email, role: "ADMIN" },
      process.env.JWT_SECRET
    );

    return res
      .status(200)
      .send({ success: true, message: "User Found", token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: `Error in UserCtrl ${error.message}` });
  }
}

async function HandleRegisterController(req, res) {
  try {
    const alreadypresent = await AdminModel.findOne({ email: req.body.email });
    if (alreadypresent) {
      console.log("Already present");
      return res
        .status(200)
        .send({ success: true, message: `User already existed` });
    }
    const salt = await bcrypt.genSalt(10); //to create a secure password
    const hashedpassword = await bcrypt.hash(req.body.password, salt); //hashing the password
    req.body.password = hashedpassword; //replacing the req password to hashedpasswor

    const newUser = AdminModel.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedpassword,
      role: "ADMIN",
    });
    const savedUser = await newUser.save();

    // const newUser = await AdminModel.create({
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: hashedpassword,
    // });

    res.status(201).send({ success: true, message: `registration successful` });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `login controller ${error.message}` });
  }
}

// async function HandleDeleteUserController(req, res) {
//   try {
//     if (!req.user) {
//       return res.status(401).send({ success: false, message: `Unauthorized` });
//     }
//     if (req.user.role !== "ADMIN") {
//       return res
//         .status(403)
//         .send({ success: false, message: `Only admin can delete users` });
//     }

//     const userId = req.body.userId;
//     const user = await UserModel.findOne({ _id: userId });
//     const doctor = await DoctorModel.findOne({ _id: userId });
//     if (user) {
//       await DoctorModel.updateMany(
//         { appointedBy: userId },
//         { $pull: { appointedBy: userId } }
//       );

//       // Delete any chat records associated with the user
//       await ChatModel.deleteMany({ userId: userId });

//       // Attempt to delete the user
//       const deleteUser = await UserModel.deleteOne({ _id: userId });
//     } else if (doctor) {
//       await UserModel.updateMany(
//         { appointedTo: userId },
//         { $pull: { appointedTo: userId } }
//       );

//       // Delete any chat records associated with the user
//       await ChatModel.deleteMany({ doctorId: userId });

//       // Attempt to delete the user
//       const deleteUser = await DoctorModel.deleteOne({ _id: userId });
//     }
//     // Check if the user was found and deleted
//     // if (deleteUser.deletedCount === 0) {
//     //   return res
//     //     .status(404)
//     //     .send({ success: false, message: `User not found` });
//     // }

//     return res.status(200).send({
//       success: true,
//       message: `User deleted successfully`,
//     });
//   } catch (error) {
//     return res.status(500).send({
//       success: false,
//       message: `Internal server error: ${error.message}`,
//     });
//   }
// }

// const mongoose = require("mongoose");

// async function HandleDeleteUserController(req, res) {
//   try {
//     // Ensure the user is authenticated and has admin privileges
//     if (!req.user) {
//       return res.status(401).send({ success: false, message: "Unauthorized" });
//     }
//     if (req.user.role !== "ADMIN") {
//       return res
//         .status(403)
//         .send({ success: false, message: "Only admin can delete users" });
//     }

//     const { userId } = req.body;
//     if (!userId) {
//       return res
//         .status(400)
//         .send({ success: false, message: "UserId is required" });
//     }

//     // Convert userId to a MongoDB ObjectId using the new keyword
//     const objectUserId = new mongoose.Types.ObjectId(userId);

//     // Try to find the user and doctor concurrently
//     const [user, doctor] = await Promise.all([
//       UserModel.findOne({ _id: objectUserId }),
//       DoctorModel.findOne({ _id: objectUserId }),
//     ]);

//     let deleteResult;
//     if (user) {
//       // Remove the userId from any doctor's appointedBy array
//       await DoctorModel.updateMany(
//         { appointedBy: objectUserId },
//         { $pull: { appointedBy: objectUserId } }
//       );

//       // Delete any chat records associated with this user
//       await ChatModel.deleteMany({ userId: objectUserId });

//       // Delete the user document from UserModel
//       deleteResult = await UserModel.deleteOne({ _id: objectUserId });
//     } else if (doctor) {
//       // Remove the doctorId from any user's appointedTo array
//       await UserModel.updateMany(
//         { appointedTo: objectUserId },
//         { $pull: { appointedTo: objectUserId } }
//       );

//       // Delete any chat records associated with this doctor
//       await ChatModel.deleteMany({ doctorId: objectUserId });

//       // Delete the doctor document from DoctorModel
//       deleteResult = await DoctorModel.deleteOne({ _id: objectUserId });
//     } else {
//       return res
//         .status(404)
//         .send({ success: false, message: "User not found" });
//     }

//     // Verify deletion
//     if (!deleteResult || deleteResult.deletedCount === 0) {
//       return res.status(404).send({
//         success: false,
//         message: "User not found or could not be deleted",
//       });
//     }

//     return res.status(200).send({
//       success: true,
//       message: "User deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     return res.status(500).send({
//       success: false,
//       message: `Internal server error: ${error.message}`,
//     });
//   }
// }

const mongoose = require("mongoose");

async function HandleDeleteUserController(req, res) {
  try {
    // Ensure the user is authenticated and has admin privileges
    if (!req.user) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .send({ success: false, message: "Only admin can delete users" });
    }

    // Debug: Log the request body
    console.log("Request Body:", req.body);

    // Directly access userId instead of destructuring
    const userId = req.body["userId"];
    if (!userId) {
      return res
        .status(400)
        .send({ success: false, message: "UserId is required" });
    }

    // Convert userId to a MongoDB ObjectId using the new keyword
    const objectUserId = new mongoose.Types.ObjectId(userId);

    // Try to find the user and doctor concurrently
    const [user, doctor] = await Promise.all([
      UserModel.findOne({ _id: objectUserId }),
      DoctorModel.findOne({ _id: objectUserId }),
    ]);

    let deleteResult;
    if (user) {
      // Remove the userId from any doctor's appointedBy array
      await DoctorModel.updateMany(
        { appointedBy: objectUserId },
        { $pull: { appointedBy: objectUserId } }
      );

      // Delete any chat records associated with this user
      await ChatModel.deleteMany({ userId: objectUserId });

      // Delete the user document from UserModel
      deleteResult = await UserModel.deleteOne({ _id: objectUserId });
    } else if (doctor) {
      // Remove the doctorId from any user's appointedTo array
      await UserModel.updateMany(
        { appointedTo: objectUserId },
        { $pull: { appointedTo: objectUserId } }
      );

      // Delete any chat records associated with this doctor
      await ChatModel.deleteMany({ doctorId: objectUserId });

      // Delete the doctor document from DoctorModel
      deleteResult = await DoctorModel.deleteOne({ _id: objectUserId });
    } else {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    // Verify deletion
    if (!deleteResult || deleteResult.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "User not found or could not be deleted",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).send({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
}

module.exports = {
  HandleLoginController,
  HandleRegisterController,
  HandleDeleteUserController,
};

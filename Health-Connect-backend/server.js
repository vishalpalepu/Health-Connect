const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { ConnectMongoDb } = require("./config/Db");
const cors = require("cors");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { UserModel } = require("./model/usermodels");
const AdminModel = require("./model/Adminmodel");
const DoctorModel = require("./model/Doctormodel");
const bcrypt = require("bcryptjs");

ConnectMongoDb();

//.env config
dotenv.config();
const app = express();

// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://localhost:3000/api/v1/Doctor/register",
//   "http://localhost:3000/api/v1/Doctor/login",
//   "http://localhost:3000/api/v1/Patient/login",
//   "http://localhost:3000/api/v1/Patient/register",
//   "http://localhost:3000/api/v1/Admin/login",
// ]; // Add all allowed frontend origins here

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true); // Allow if origin is in the list
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, // Allow cookies or authorization headers
//   })
// );

// Define allowed origins
const allowedOrigins = [
  "http://localhost:3000", // Local development
];

// Dynamically set CORS headers
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // If you're using cookies/auth headers
  })
);

// Set fallback headers for other HTTP methods
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin); // Allow based on request's origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(express.json());
app.use(morgan("dev"));

const UserRoute = require("./route/UserRoutes");
const DoctorRoute = require("./route/DoctorRoutes");
const AdminRoute = require("./route/AdminRoutes");
const authMiddleware = require("./middlewares/authentication");
const chatModel = require("./model/ChatModel");

app.use(authMiddleware);

app.use("/api/v1/user", UserRoute);
app.use("/api/v1/Doctor", DoctorRoute);
app.use("/api/v1/Admin", AdminRoute);

app.post("/forgot-password", async (req, res) => {
  try {
    const email = req.body.email;
    var user = null;
    if (req.body.role === "DOCTOR") {
      user = await DoctorModel.findOne({ email });
    } else if (req.body.role === "USER") {
      user = await UserModel.findOne({ email });
    } else if (req.body.role === "ADMIN") {
      user = await AdminModel.findOne({ email });
    }

    if (!user) return res.status(404).send("User not found");

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now

    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpiry = tokenExpiry;
    await user.save();

    const resetLink = `http:/localhost:3000/reset-password/${resetToken}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: "healthconnect675@gmail.com", pass: "12HealthConnect12" },
    });

    const mailOptions = {
      from: "healthconnect675@gmail.com",
      to: email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return res.status(500).send("Error sending email");
      res.send("Password reset email sent");
    });
  } catch (err) {
    console.log("Error in forgotpasswrod", err);
    re.status(500).send({
      success: false,
      message: `internal server error ${err}`,
    });
  }
});

app.post("/reset-password/:token", async (req, res) => {
  try {
    const bcrypt = require("bcrypt");

    app.post("/reset-password/:token", async (req, res) => {
      const { token } = req.params;
      const { newPassword } = req.body;

      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetTokenExpiry: { $gt: Date.now() }, // Check token validity
      });

      if (!user) return res.status(400).send("Invalid or expired token");

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      // Clear token and expiry fields
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiry = undefined;

      await user.save();
      res.send("Password has been reset successfully");
    });
  } catch (err) {
    console.log("inside reset password", err);
    res
      .status(500)
      .send({ success: true, message: `internal server error ${err}` });
  }
});

app.post("/api/v1/chat/:id", async (req, res) => {
  try {
    const content = req.body.content;
    const userId = req.user.id; // Extract userId from the request body

    if (!content) {
      return res
        .status(400)
        .send({ success: false, message: "No content in the chat" });
    }

    if (!userId) {
      return res
        .status(400)
        .send({ success: false, message: "No userId provided" });
    }

    const contentEntry = await chatModel.create({
      doctorId: req.params.id,
      content: content,
      userId: userId,
    });

    return res.status(201).send({ success: true, data: contentEntry });
  } catch (error) {
    console.error("Error creating chat entry:", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
});

app.post("/api/v1/chat/getChatView/:id", async (req, res) => {
  try {
    const userId = req.user.id;

    const content = await chatModel
      .find({
        doctorId: req.params.id,
        userId: userId,
      })
      .populate({
        path: "doctorId",
        select: "name",
        model: DoctorModel,
      })
      .populate({
        path: "userId",
        select: "name",
        model: UserModel,
      })
      .sort({ createdAt: -1 });
    console.log(content);

    return res
      .status(200)
      .send({ success: true, message: "Chat is present.", content });
  } catch (error) {
    console.error("Error retrieving chat messages:", error); // Log the error
    return res.status(500).send({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
});

const port = process.env.PORT || 5000;
0;
app.listen(port, () => {
  console.log(
    `server running at ${process.env.PORT} in ${process.env.DEV_MODE}`.bgCyan
      .black
  );
});

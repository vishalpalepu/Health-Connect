const { UserModel, UserMedicalDataModel } = require("../model/usermodels.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

async function HandleLoginController(req, res) {
  try {
    const alreadypresent = await UserModel.findOne({ email: req.body.email });
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
      {
        id: alreadypresent._id,
        name: alreadypresent.name,
        email: req.body.email,
        role: "USER",
      },
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
    const alreadypresent = await UserModel.findOne({ email: req.body.email });
    if (alreadypresent) {
      console.log("Already present");
      return res
        .status(200)
        .send({ success: true, message: `User already existed` });
    }
    const salt = await bcrypt.genSalt(10); //to create a secure password
    const hashedpassword = await bcrypt.hash(req.body.password, salt); //hashing the password
    req.body.password = hashedpassword; //replacing the req password to hashedpasswor

    const newUser = UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedpassword,
      role: "USER",
    });

    // const newUser = await UserModel.create({
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

async function HandleAddUserMedicalDataContoller(req, res) {
  try {
    if (!req.user) {
      return res
        .status(401)
        .send({ success: false, message: "user not found" });
    }
    {
      const medicalData = req.body;
      console.log(medicalData);

      const newEntry = await UserMedicalDataModel.create({
        userId: req.user.id,
        ...medicalData,
      });

      console.log(req.user);
      const user = await UserModel.findById(req.user.id);
      user.medicalData.push(newEntry.userId);
      await user.save();

      return res.status(201).send({
        success: true,
        message: "Medical Data has been added",
        data: newEntry,
      });
    }
  } catch (error) {
    console.error("Error adding medical data:", error);
    res
      .status(500)
      .send({ success: false, message: `Invalid input Data ${error.message}` });
  }
}

async function HandleUserProfileController(req, res) {
  try {
    const user = req.user;

    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "User not found " });

    return res.status(200).send({ success: true, message: "successful", user });
  } catch (error) {
    console.log("Error in HandleUserProfileController", error);
    return res
      .status(500)
      .send({ success: false, message: "internal server error " });
  }
}

// function to update user profile
async function HandleUpdateUserProfileController(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .send({ successs: true, message: `no one is present to update it` });
    }
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: user.id },
      req.body,
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return res
        .status(404)
        .send({ success: false, message: `user not found` });
    }
    return res.status(200).send({
      success: true,
      message: `updated the values`,
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `internal server error ${error.message}`,
    });
  }
}

async function HandleAllUserDetailsController(req, res) {
  {
    const allUserDetails = await UserModel.find({});
    // if (!req.user) {
    //   return res
    //     .status(401)
    //     .send({ success: false, message: `User Not Found ` });
    // }

    if (!allUserDetails) {
      return res
        .status(404)
        .send({ success: false, message: `no data is not found` });
    }

    return res.status(200).send({
      success: true,
      message: `sent the details successfully `,
      allUserDetails,
    });
  }
}

async function HandleGetUserMedicalDataForDoctorContoller(req, res) {
  try {
    if (!req.user) {
      return res.status(401).send({ success: false, message: `Unauthorized` });
    }
    // const userMedicalDetails = await UserModel.findById(
    //   req.body.userId
    // ).populate("medicalData");

    if (!req.body.userId) {
      return res.status(401).send({ success: false, message: `Unauthorized` });
    }

    const userMedicalDetails = await UserMedicalDataModel.find({
      userId: req.body.userId,
    })
      .sort({ Date: -1 })
      .limit(1);

    // const userMedicalDetails = await UserMedicalDataModel.find({
    //   userId: req.body.userId,
    // });

    if (!userMedicalDetails) {
      return res
        .status(201)
        .status({ success: false, message: `no medical details are given` });
    }

    return res.status(200).send({
      success: true,
      message: `User Medical is Sent `,
      userMedicalDetails,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `internal server error ${error.message}`,
    });
  }
}
async function HandleGetAppointedDoctorController(req, res) {
  try {
    if (!req.user) {
      return res.status(401).send({ success: false, message: `Unauthorized ` });
    }
    const allUser = await UserModel.find({ _id: req.user.id }).populate(
      "appointedTo"
    );
    if (!allUser) {
      return res.status(201).send({
        success: false,
        message: `no doctor is appointed to the user`,
      });
    }

    return res
      .status(200)
      .send({ success: true, message: `doctor Sent Successfully`, allUser });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
}

module.exports = {
  HandleLoginController,
    HandleRegisterController,
  HandleUserProfileController,
  HandleAddUserMedicalDataContoller,
  HandleUpdateUserProfileController,
  HandleAllUserDetailsController,
  HandleGetUserMedicalDataForDoctorContoller,
  HandleGetAppointedDoctorController,
};

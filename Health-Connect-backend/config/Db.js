const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
dotenv.config();

const ConnectMongoDb = async () => {
  try {
    console.log(process.env.MONGO_URL);
    await mongoose.connect(`${process.env.MONGO_URL}`);

    console.log(
      `connection Successful ${mongoose.connection.host}`.bgGreen.white
    );
  } catch (error) {
    console.log(`connection Issue ${error}`.bgRed.white);
  }
};

module.exports = {
  ConnectMongoDb,
};

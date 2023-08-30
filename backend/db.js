const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Database is connected");
      })
      .catch((err) => {
        console.log("There is an error! Cannot access database. ", err.message);
      });
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

module.exports = connectDB;

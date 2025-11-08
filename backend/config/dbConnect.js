const mongoose = require("mongoose");
const { DB_URL } = require("./dotenv.config");
require("dotenv").config()

async function connectDb() {
  try {
    await mongoose.connect(DB_URL);
    console.log("DB Connected successfully");
  } catch (error) {
    console.log(error);
  }
}


module.exports = connectDb
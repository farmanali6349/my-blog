const mongoose = require("mongoose");
const config = require("../config/config");
async function connectDb() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log("Database is connected : ", config.mongodbUri);
  } catch (error) {
    console.log("Database Connection Failed", config.mongodbUri);
  }
}

module.exports = connectDb;

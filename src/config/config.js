require("dotenv").config();

const config = {
  mongodbUri: process.env.MONGODB_URI,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
};

module.exports = config;

const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/user.model");
function authentication(req, res, next) {
  try {
    const token = req.cookies["authToken"];
    req.userdata = null;

    if (!token) return next();

    jwt.verify(token, config.jwtSecret, async (err, data) => {
      if (err) {
        console.log("Error in JWT token verification.", err);
        return next();
      }

      // Checking for user
      const userInDatabase = await User.findOne({ _id: data.id });
      if (!userInDatabase) return next();

      const { _id, name, email, username } = userInDatabase;
      req.userdata = { id: _id, name, email, username };
      return next();
    });
  } catch (error) {
    console.log("Error in authentication token", error);
    next();
  }
}

module.exports = authentication;

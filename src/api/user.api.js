const express = require("express");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const { name, username, email, password } = req.body;
  let errors = {};
  let formData = req.body;
  let userdata = req.userdata;

  // Checking Email
  let isEmailExist = await User.findOne({ email });

  if (isEmailExist) {
    errors.message = "User Already Exist Go To SignIn";
    res.render("signup", { errors, formData, userdata });
  } else if (!isEmailExist) {
    // Checking Username
    const isUsernameExist = await User.findOne({ username });
    if (isUsernameExist) {
      errors.username = "Username is already taken, try another";
      res.render("signup", { errors, formData, userdata });
    } else if (!isEmailExist) {
      // Creating New user
      try {
        //   1. Hashing Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, async (err, hash) => {
            if (hash) {
              const newUser = await User.create({
                name,
                username,
                email,
                password: hash,
                posts: [],
              });

              if (newUser) {
                errors.message = "Account Created !! Now Login";
                formData = { email: newUser.email };
                res.render("login", { errors, formData, userdata });
              }
            }
          });
        });

        // errors.message = "Some Server Or Database Error Occured";
        // res.render("signup", { errors, formData, userdata });
      } catch (error) {
        errors.message = "Some Server Or Database Error Occured";
        res.render("signup", { errors, formData, userdata });
      }
    }
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const errors = {};
  const formData = req.body;
  const userdata = req.userdata;

  try {
    const userInDatabase = await User.findOne({ email });

    if (!userInDatabase) {
      errors.message = "User Does Not Exist !! Signup First";
      res.render("login", { errors, formData, userdata });
    } else if (userInDatabase) {
      // Checking For Password Validation
      bcrypt.compare(password, userInDatabase.password, (err, result) => {
        if (err) {
          errors.message = "Some Server Error Occured";
          return res.render("login", { errors, formData, userdata });
        }
        if (result) {
          // User is verified
          jwt.sign(
            { email: userInDatabase.email, id: userInDatabase._id },
            jwtSecret,
            (err, token) => {
              res.cookie("authToken", token);
              return res.redirect("/");
            }
          );
        } else {
          errors.message = "Username Or Password Is Incorrect";
          return res.render("login", { errors, formData, userdata });
        }
      });
    }
  } catch (error) {
    errors.message = "Some Database Or Server Error";
    res.render("login", { errors, formData, userdata });
  }
});

userRouter.get("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.redirect(req.refrer || "/");
});
module.exports = userRouter;

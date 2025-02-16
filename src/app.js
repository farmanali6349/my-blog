const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const config = require("./config/config");
const connectDb = require("./db/db");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { URL } = require("url");

// Middlewares
const authentication = require("./middlewares/authentication");
const protectedRoute = require("./middlewares/protectedRoute");

// Models
const User = require("./models/user.model");
const Post = require("./models/post.model");

// Api's
const userApi = require("./api/user.api");
const postApi = require("./api/post.api");
const commentApi = require("./api/comment.api");

async function main() {
  await connectDb();
  // Connecting Database
  const app = express();

  // Setting Up Some Middlewares
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(express.static(path.join(__dirname, "../public")));

  // Authentication
  app.use(authentication);

  // USER API
  app.use("/user", userApi);

  // POST API
  app.use("/post", postApi);

  // COMMENT API
  app.use("/comment", commentApi);

  // Setting Template Engine EJS
  app.set("view engine", "ejs");

  app.get("/", async (req, res) => {
    const posts = await Post.find().populate("user");
    res.render("home", { userdata: req.userdata, posts });
  });

  app.get("/signup", (req, res) => {
    if (req.userdata) {
      res.redirect("/");
    }
    res.render("signup", {
      errors: {},
      formData: {},
      userdata: {},
    });
  });

  app.get("/login", (req, res) => {
    const refrer = new URL(req.get("Referer")).pathname;

    console.log("[ref in login]", refrer);
    if (req.userdata) {
      res.redirect(refrer || "/");
    }

    res.render("login", { errors: {}, formData: {}, userdata: {} });
  });

  app.get("/create-post", protectedRoute, (req, res) => {
    res.render("create_post", {
      errors: {},
      formData: {},
      userdata: req.userdata,
    });
  });
  app.get("/post/edit/:permalink", protectedRoute, async (req, res) => {
    const requestedPostPermalink = req.params.permalink;

    const postInDatabase = await Post.findOne({
      permalink: requestedPostPermalink,
    });

    if (!postInDatabase)
      return res.status(404).json({
        message: `No post found with such permalink: ${requestedPostPermalink}`,
      });

    const { _id, title, permalink, content } = postInDatabase;

    res.render("edit_post", {
      errors: {},
      formData: { id: _id, title, permalink, content },
      userdata: req.userdata,
    });
  });

  app.get("/user/:username", async (req, res) => {
    try {
      const requestUser = await User.findOne({
        username: req.params.username,
      }).populate({
        path: "posts",
        populate: {
          path: "user",
          select: "username",
        },
      });

      if (!requestUser) {
        return res.status(404).json({ message: "User not found" });
      }

      req.userdata.isAuthor =
        requestUser._id.toString() === req?.userdata?.id.toString();
      const { _id, name, username, posts } = requestUser;

      console.log(requestUser.posts);
      // Checking for author
      res.render("user", {
        userdata: req.userdata,
        author: { id: _id, name, username, posts },
      });
    } catch (error) {
      console.log("Error retriving user from database.", error);
      res.json({ message: "Error getting user from database" });
    }
  });

  app.get("/post/:postPermalink", async (req, res) => {
    const requestedPost = await Post.findOne({
      permalink: req.params.postPermalink,
    })
      .populate("user", "username email") // Populate the post author (user)
      .populate({
        path: "comments",
        populate: {
          path: "user", // Populate the user inside each comment
          select: "username email _id",
        },
      })
      .exec();

    if (requestedPost) {
      res.render("post", { userdata: req.userdata, post: requestedPost });
    }
  });

  app.listen(config.port || 3000, () => {
    console.log(`Server listening at http://localhost:${config.port}`);
  });

  module.exports = { protectedRoute };
}

main();

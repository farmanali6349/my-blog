const express = require("express");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const postRouter = express.Router();
const { URL } = require("url");
const protectedRoute = require("../middlewares/protectedRoute");
postRouter.post("/create", async (req, res) => {
  const { title, permalink, content } = req.body;
  const userId = req.userdata.id;

  // Checking If Permalink Exist
  try {
    const postInDatabase = await Post.findOne({ permalink });
    if (postInDatabase) {
      res.render("create_post", {
        errors: {
          permalink:
            "A post is already available with this permalink, do some change in permalink and submit",
        },
        formData: req.body,
        userdata: req.userdata,
      });
    } else if (!postInDatabase) {
      try {
        // Creating New Post
        const newPost = await Post.create({
          title,
          permalink,
          content,
          user: userId,
          likes: [],
          comments: [],
        });

        if (newPost) {
          // Updating User
          const userInDatabase = await User.findOne({ _id: userId });

          userInDatabase.posts.push(newPost._id);
          await userInDatabase.save();

          res.redirect(`/post/${newPost.permalink}`);
        } else {
          res.render("create_post", {
            errors: { message: "Database Error" },
            formData: req.body,
            userdata: req.userdata,
          });
        }
      } catch (error) {
        res.render("create_post", {
          errors: { message: "Database Error" },
          formData: req.body,
          userdata: req.userdata,
        });
      }
    }
  } catch (error) {
    console.error("Post Creation Error:", error);
    res.render("create_post", {
      errors: { message: "Database Error" },
      formData: req.body,
      userdata: req.userdata,
    });
  }
});

postRouter.get("/like/:postId", protectedRoute, async (req, res) => {
  const userId = req.userdata.id;
  const refrer = new URL(req.get("Referer")).pathname;
  console.log("[ref in like] : ", refrer);

  try {
    const postInDatabase = await Post.findOne({ _id: req.params.postId });

    // Checking Whether User Already Liked It
    const likeIndex = postInDatabase.likes.findIndex(
      (like) => like.toString() === userId.toString()
    );

    if (likeIndex === -1) {
      postInDatabase.likes.push(userId);
      await postInDatabase.save();
      res.redirect(refrer || "/");
    } else {
      postInDatabase.likes.splice(likeIndex, 1);
      await postInDatabase.save();
      res.redirect(refrer || "/");
    }
  } catch (error) {
    res.json({ error: "Some error in database" });
  }
});

postRouter.get("/delete/:postId", protectedRoute, async (req, res) => {
  const postId = req.params.postId;
  const refrer = req.refrer
    ? req.refrer
    : req.get("Referer")
    ? new URL(req.get("Referer")).pathname
    : "/";

  try {
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Deleting Comments In Post
    await Comment.deleteMany({ _id: { $in: post.comments } });

    // Deleting Post
    await post.deleteOne();

    console.log("ref: in del post", refrer);
    console.log("type: ", typeof refrer);

    if (refrer.includes("post")) {
      console.log("Redirecting to home");
      return res.redirect("/");
    }
    console.log("Redirecting to outside as well");
    res.redirect(refrer);
  } catch (error) {
    res.json({ error: "Some error in database" });
  }
});

postRouter.post("/update/:postId", protectedRoute, async (req, res) => {
  const { title, permalink, content } = req.body;
  const postId = req.params.postId;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        permalink,
        content,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPost) {
      res.render("create_post", {
        errors: { message: "Error updating the post" },
        formData: req.body,
        userdata: req.userdata,
      });
    }

    res.redirect(`/post/${updatedPost.permalink}`);
  } catch (error) {
    return res.render("edit_post", {
      errors: { message: "Error Occured In Database" },
      formData: req.body,
      userdata: req.userdata,
    });
  }
});

module.exports = postRouter;

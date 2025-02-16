const express = require("express");
const protectedRoute = require("../middlewares/protectedRoute");
const { URL } = require("url");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");

const commentRouter = express.Router();

commentRouter.post("/create/:postId", protectedRoute, async (req, res) => {
  const refrer = req.refrer
    ? req.refrer
    : req.get("Referer")
    ? new URL(req.get("Referer")).pathname
    : "/";
  req.body.userId = req.userdata ? req.userdata?.id : null;
  req.body.postId = req.params.postId;

  const { comment, userId, postId } = req.body;

  try {
    // Creating Comment
    console.log("[Flow.1. Creating Comment]");
    const newComment = await Comment.create({
      text: comment,
      user: userId,
      likes: [],
    });

    if (newComment) {
      console.log("[Flow.2. Comment Created]");
      // Updating The Post With Comment
      const postInDatabase = await Post.findOne({ _id: postId });
      if (postInDatabase) {
        console.log("[Post Found: ]", postInDatabase);
        console.log("[Flow.3. Updating Post]");
        postInDatabase.comments.push(newComment._id);
        await postInDatabase.save();
        console.log("[Flow.4. Done]");
        res.redirect(refrer);
      } else {
        res.json({ error: "Error Updating Post" });
      }
    } else {
      res.json({ error: "Some error occured in database" });
    }
  } catch (error) {
    res.json({ error: "Some error occured in database" });
  }
});

commentRouter.get("/like/:commentId", protectedRoute, async (req, res) => {
  const refrer = req.refrer
    ? req.refrer
    : req.get("Referer")
    ? new URL(req.get("Referer")).pathname
    : "/";

  req.body.userId = req.userdata ? req.userdata?.id : null;
  req.body.commentId = req.params.commentId;

  const { userId, commentId } = req.body;

  // Updating The Comment With Like
  try {
    const commentInDatabase = await Comment.findOne({ _id: commentId });

    // Checking If User Has Already Liked -> The Dislike
    const commentIndex = commentInDatabase.likes.findIndex(
      (like) => like.toString() === userId
    );

    if (commentIndex === -1) {
      // User hasn't liked yet, so going to like
      commentInDatabase.likes.push(userId);
      await commentInDatabase.save();
      res.redirect(refrer);
    } else {
      // User has already liked it, so going to dislike
      commentInDatabase.likes.splice(commentIndex, 1);
      await commentInDatabase.save();
      res.redirect(refrer);
    }
  } catch (error) {
    res.json({ error: "Some error occured in database" });
  }
});

commentRouter.get(
  "/delete/:commentId/:postId",
  protectedRoute,
  async (req, res) => {
    const refrer = req.refrer
      ? req.refrer
      : req.get("Referer")
      ? new URL(req.get("Referer")).pathname
      : "/";

    const commentId = req.params.commentId;
    const postId = req.params.postId;

    try {
      // Deleting comment
      const deletedComment = await Comment.findOneAndDelete(
        { _id: commentId },
        { new: true }
      );

      if (deletedComment) {
        // Also deleting it from posts
        const postInDatabase = await Post.findOne({ _id: postId });

        if (postInDatabase) {
          const commentIndex = postInDatabase.comments.findIndex(
            (comment) => comment.toString() === commentId
          );

          if (commentIndex !== -1) {
            postInDatabase.comments.splice(commentIndex, 1);
            await postInDatabase.save();
            res.redirect(refrer);
          } else {
            res.json({ error: "Comment is already deleted" });
          }
        } else {
          res.json({ error: "Couldn't Found in database" });
        }
      }
    } catch (error) {
      console.log(error);
      res.json({ message: "Some error occured in database", error });
    }
  }
);

module.exports = commentRouter;

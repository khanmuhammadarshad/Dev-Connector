const express = require("express");
const router = express.Router();
const request = require("request");
const config = require("config");
const Auth = require("../../middleWare/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator/check");
const mongoose = require("mongoose");

//@route    Post api/post
//@desc    add new post by user
//@access Public
router.post(
  "/",
  [Auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
);

//@route    GET api/post
//@desc    get all post
//@access Public
router.get("/", async (req, res) => {
  try {
    const post = await Post.find().sort({ date: -1 });
    res.json(post);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

//@route    GET api/post
//@desc    get post by user id
//@access Public
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "post not found" });
    }
    res.json(post);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    console.log("error : ", error);
    res.status(500).send("Server error");
  }
});

//@route    DELETE api/post
//@desc    delete post by id
//@access Public
router.delete("/:id", Auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log("post : ", post);
    if (!post) {
      return res.status(401).json({ msg: "no post avaliabled" });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User Not Authorized" });
    }
    await post.remove();
    res.json({ msg: "post deleted" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    console.log("error : ", error);
    res.status(500).send("Server error");
  }
});

//@route    PUT api/post
//@desc    Like post by user
//@access Public
router.put("/like/:id", Auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log("post : ", post);
    if (!post) {
      return res.status(401).json({ msg: "no post avaliabled" });
    }
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      const removeIndex = post.likes
        .map((like) => like.user.toString())
        .indexOf(req.user.id);
      post.likes.splice(removeIndex, 1);
      await post.save();
      res.json(post);
    } else {
      post.likes.unshift({ user: req.user.id });
      await post.save();
      res.json(post);
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    console.log("error : ", error);
    res.status(500).send("Server error");
  }
});

//@route    POST api/post
//@desc    Comments post by user
//@access Public
router.post(
  "/comment/:id",
  [Auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      console.log("post : ", post);
      if (!post) {
        return res.status(401).json({ msg: "no post avaliabled" });
      }
      const user = await User.findById(req.user.id).select("-password");
      let comment = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      };
      post.comments.unshift(comment);
      await post.save();
      res.json(post);
    } catch (error) {
      if (error.kind === "ObjectId") {
        return res.status(404).json({ msg: "post not found" });
      }
      console.log("error : ", error);
      res.status(500).send("Server error");
    }
  }
);

//@route    PUT api/post/comment
//@desc    Comment post by user
//@access Public
router.put(
  "/comment/:id",
  [Auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    try {
      const posts = await Post.updateOne(
        { "comments._id": req.params.id },
        { $set: { "comments.$.text": req.body.text } }
      );
      res.json({ msg: "Updated" });
      const objectId = mongoose.Types.ObjectId(req.params.id);
      let post = await Post.aggregate([
        {
          $match: {
            comments: {
              $elemMatch: {
                _id: objectId,
              },
            },
          },
        },
        {
          $project: {
            comments: {
              $filter: {
                input: "$comments",
                as: "comments",
                cond: {
                  $eq: ["$$comments._id", objectId],
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: "user",
            localField: comment.user,
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$comments",
        },
      ]);
      console.log("post : ", post);
    } catch (error) {
      if (error.kind === "ObjectId") {
        return res.status(404).json({ msg: "post not found" });
      }
      console.log("error : ", error);
      res.status(500).send("Server error");
    }
  }
);

//@route    DELETE api/post/comment
//@desc    delete comment by id
//@access pravite
router.delete("/:id/:comment_id", Auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log("post : ", post);
    if (!post) {
      return res.status(401).json({ msg: "no post avaliabled" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(401).json({ msg: "comment does not exists" });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User Not Authorized" });
    }
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();

    res.json({ msg: "comment deleted" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "comment not found" });
    }
    console.log("error : ", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;

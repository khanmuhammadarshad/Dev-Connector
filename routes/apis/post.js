const express = require("express");
const router = express.Router();
const request = require("request");
const config = require("config");
const Auth = require("../../middleWare/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator/check");

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

module.exports = router;

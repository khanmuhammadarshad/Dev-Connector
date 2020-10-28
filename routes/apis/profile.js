const express = require("express");
const router = express.Router();
const request = require("request");
const config = require("config");
const Auth = require("../../middleWare/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator/check");
//@route    Get api/users
//@desc    Test Route
//@access Public

router.get("/me", Auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server Error");
  }
});
router.post(
  "/",
  Auth,
  [
    check("status", "status is required").not().isEmail(),
    check("skills", "skills is required").not().isEmpty(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({
        errors: error.array(),
      });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    ///Build profile object

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skills) => skills.trim());
    }
    profileFields.social = {};
    if (youtube) profileFields.youtube = youtube;
    if (twitter) profileFields.twitter = twitter;
    if (facebook) profileFields.facebook = facebook;
    if (linkedin) profileFields.linkedin = linkedin;
    if (instagram) profileFields.instagram = instagram;
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(err.message);
      res.status(500).send("server Error");
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const profile = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profile);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile)
      return res
        .status(500)
        .json({ msg: "there is no profile  for this user" });
    res.json(profile);
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.status(500).json({ msg: "profile not found" });
    }
    res.status(500).send("Server Error");
  }
});
router.delete("/", Auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "user deleted" });
  } catch (error) {
    console.log("error :", error);
    res.status(500).send("server error");
  }
});
router.put(
  "/experience",
  Auth,
  [
    check("title", "Title is required").not().isEmpty(),
    check("company", "Company is required").not().isEmpty(),
    check("from", "From is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.log("error : ", error);
      res.status(500).send("Server Error");
    }
  }
);
router.delete("/experience/:exp_id", Auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    console.log("profile :", profile);
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/github/:username", async (req, res) => {
  try {
    let url = `https://api.github.com/users/${
      req.params.username
    }/repos?sort=created:asc&client_id=${config.get(
      "githubClientId"
    )}&client_secret=${config.get("githubSecret")}`;
    request(
      {
        url: url,
        headers: {
          "User-Agent": req.params.username,
        },
      },
      (error, response, body) => {
        console.log("error", error);
        console.log("response", response);
        console.log("body", body);
        if (error) console.error(error);
        if (response.statusCode !== 200) {
          return res.status(404).json({ msg: "No Githib profile found" });
        }
        res.json(JSON.parse(body));
      }
    );
  } catch (error) {
    console.log("github Error ", error);
    res.status(500).json("Server Error");
  }
});
module.exports = router;

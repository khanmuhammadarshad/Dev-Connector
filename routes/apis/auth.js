const express = require("express");
const router = express.Router();
const auth = require("../../middleWare/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
//@route    Get api/users
//@desc    Test Route
//@access Public

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).send("server error");
  }
});
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user === null) {
        return res
          .status(400)
          .json({ error: [{ msg: "Invalid Credentails" }] });
      }
      console.log("user", user);

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ error: [{ msg: "Invalid Credentails" }] });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      let getToken = config.get("JWTSecret");
      jwt.sign(
        payload,
        getToken,
        {
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      //   res.send("User Register Successfully");
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;

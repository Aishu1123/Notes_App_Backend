const express = require("express");

const { UserModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();

// register user
userRouter.post("/register",async(req, res) => {
  const { username, email, password, city } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ msg: "User already registered with this email ID." });
    }
    bcrypt.hash(password, 6, async(err, hash)=> {
      if (hash) {
        const newUser = new UserModel({
          username,
          email,
          password: hash,
          city,
        });
        await newUser.save();
        res.status(200).send({ msg: "New user Registered Successfully." });
      }else{
        res.status(400).send({ msg: "Internal server error.", "Error:": err });
      }
     });
  } catch (err) {
    res.status(400).send({ msg: "Internal server error.", "Error:": err });
  }
});

// login user

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const access_token = jwt.sign(
          {
            userID: user._id,
            author: user.username,
          },
          "aishu"
        );
        res
          .status(200)
          .send({ msg: "User Logged in Successfully.", access_token });
} else {
        res.status(400).send({ msg: "Wrong Credentials." });
      }
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(400).send({ msg: "Bad Request." });
  }
});

module.exports = {
  userRouter,
};

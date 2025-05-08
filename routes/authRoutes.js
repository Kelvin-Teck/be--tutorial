const express = require("express");
const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// import db from "../models/index.js";
const { User } = db;
const router = express.Router();
const {
  userValidationSchema,
  loginUserValidationSchema,
} = require("../utils/validators");
const { where } = require("sequelize");

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // validate this user input

    const { error, value } = userValidationSchema.validate({
      firstName,
      lastName,
      email,
      password,
    });

    if (error) {
      return res.status(403).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ where: { email: value.email } });

    if (user) {
      return res
        .status(403)
        .json({ message: "A User alreasy exist with this email" });
    }

    // Hash the password .
    const hashPassword = await bcrypt.hash(value.password, 10);

    await User.create({
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      password: hashPassword,
    });

    return res.status(200).json({ message: "User Created Successfully" });
  } catch (error) {
    return res
      .status(402)
      .json({ message: `An error unknown occured ${error.message} ` });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate the user input

    const { error, value } = loginUserValidationSchema.validate({
      email,
      password,
    });

    if (error) {
      return res.status(403).json({ message: error.details[0].message });
    }

    // confirm the existence of user

    const user = await User.findOne({ where: { email: value.email } });

    if (!user) {
      return res.status(403).json({ message: "Incorrect email" });
    }

    // check the password validity
    const checkPassword = await bcrypt.compare(value.password, user.password);

    if (!checkPassword) {
      return res.status(403).json({ message: "Incorrect Password" });
    }

    // generate auth token

    const token = jwt.sign({ id: user.id, email: user.email }, "secret-key", {
      expiresIn: "1m",
    });

    return res
      .status(200)
      .json({ message: "User Logged in successfully", accessToken: token });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

const express = require("express");
const db = require("../models");
const { Auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/all-users", Auth, async (req, res) => {
  try {
    const allUsers = await db.User.findAll();

    if (!allUsers) {
      return res.status(404).json({ message: "No Users Found in our Record" });
    }

    return res
      .status(200)
      .json({ message: "Users Successfully retrieved", users: allUsers });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";

// Get / Admin - Login page
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "My simple blog created w/ node, express & mongodb.",
    };

    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log("Error:", error);
  }
});

// POST / Check Login
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      req.body.username === "zawlinnaing" &&
      req.body.password === "zawlin@2023"
    ) {
      res.send("You are logged in!");
    } else {
      res.send("Wrong username or password!");
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

// POST / Admin - Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const harshedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({
        username,
        password: harshedPassword,
      });

      res.status(201).json({ message: "New User account created!", user });
    } catch (err) {
      console.log("Error:", err);
    }
  } catch (error) {
    if (error.code === 1100) {
      res.status(409).json({ message: "User already in use!" });
    }

    res.status(500).json({ message: "Internal server error!" });
  }
});

module.exports = router;

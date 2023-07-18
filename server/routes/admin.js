const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

// Get / Check Login (Middleware)
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

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

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/dashboard");
  } catch (error) {
    console.log("Error:", error);
  }
});

// GET / Admin - Dashboard
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "My simple blog created w/ node, express & mongodb.",
    };

    const data = await Post.find();
    res.render("admin/dashboard", { locals, data, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// GET / Admin - Create new post
router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "My simple blog created w/ node, express & mongodb.",
    };
    res.render("admin/add-post", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// POST / Admin - Create new post
router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });
      await Post.create(newPost);

      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
    }
  } catch (error) {
    console.log(error);
  }
});

// GET / Admin - Edit post
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "My simple blog created w/ node, express & mongodb.",
    };
    const data = await Post.findOne({ _id: req.params.id });

    res.render("admin/edit-post", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

// PUT / Admin - Edit post
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });

    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    console.log(error);
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

// DELETE / Admin - Delete post
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

// GET / Admin - Log out
router.get("/logout", async (req, res) => {
  res.clearCookie("token");
  // res.json({ message: "Logged out successfully!" });
  res.redirect("/");
});

module.exports = router;

const express = require("express");
const router = express.Router();

// Routes
router.get("", (req, res) => {
  //   res.send("hello, world!");
  const locals = {
    title: "Zaw Lin's Blog",
    description: "My simple blog created w/ node, express & mongodb.",
  };

  res.render("index", { locals });
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

module.exports = router;

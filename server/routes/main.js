const express = require("express");
const router = express.Router();

// Routes
router.get("", (req, res) => {
  res.send("hello, world!");
});

module.exports = router;

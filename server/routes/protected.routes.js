const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth");

router.get("/dashboard", isAuth, (req, res) => {
  res.json({
    message: "Welcome to the protected dashboard",
    user: req.user,
  });
});

module.exports = router;

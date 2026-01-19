const express = require("express");
const axios = require("axios");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.post("/portfolio/optimize", isAuth, async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/portfolio/optimize",
      req.body
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Portfolio optimization failed" });
  }
});

module.exports = router;

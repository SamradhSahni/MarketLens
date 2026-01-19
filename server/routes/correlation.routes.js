const express = require("express");
const axios = require("axios");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.post("/correlation/network", isAuth, async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/correlation/network",
      req.body,
      { timeout: 15000 }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Correlation route error:", err.response?.data || err.message);
    res.status(500).json({
      message: "Correlation network failed",
      error: err.response?.data || err.message,
    });
  }
});

module.exports = router;

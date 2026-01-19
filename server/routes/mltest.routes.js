const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/ml/health", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8000/health");
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "ML service unreachable" });
  }
});

module.exports = router;

const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/overview", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:8000/index/overview"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Index route error:", error.message);
    res.status(500).json({ message: "Index overview failed" });
  }
});

module.exports = router;

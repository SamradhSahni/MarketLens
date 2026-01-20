const express = require("express");
const axios = require("axios");
const router = express.Router();

/**
 * GET /api/sector/overview
 */
router.get("/sector/overview", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:8000/sector/overview"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Sector route error:", error.message);
    res.status(500).json({ message: "Sector overview failed" });
  }
});

module.exports = router;

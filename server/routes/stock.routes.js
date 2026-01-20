const express = require("express");
const axios = require("axios");
const router = express.Router();

/**
 * GET /api/stocks/list
 * Returns stock universe for dropdowns
 */
router.get("/stocks/list", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8000/stocks/list");
    res.json(response.data);
  } catch (err) {
    console.error("Stock list error:", err.message);
    res.status(500).json({ message: "Failed to load stock list" });
  }
});

/**
 * GET /api/stocks/:symbol
 * Individual stock analysis
 */
router.get("/stocks/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const response = await axios.get(
      `http://localhost:8000/stock/${symbol}`
    );
    res.json(response.data);
  } catch (err) {
    console.error("Stock route error:", err.message);
    res.status(500).json({ message: "Stock analysis failed" });
  }
});

module.exports = router;

const express = require("express");
const axios = require("axios");
const isAuth = require("../middlewares/isAuth");
const router = express.Router();

router.post("/predict", isAuth, async (req, res) => {
  try {
    const response = await axios.post("http://localhost:8000/predict", req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Prediction failed" });
  }
});

module.exports = router;

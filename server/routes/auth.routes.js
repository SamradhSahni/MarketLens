const express = require("express");
const router = express.Router();
const { signup, login, logout } = require("../controllers/auth.controller");

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.post("/auth/logout", logout);

module.exports = router;

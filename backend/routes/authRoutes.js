const express = require("express");
const router = express.Router();

// Import auth logic from controller
const { register, login } = require("../controllers/authController");

// USER REGISTRATION
router.post("/register", register);

// USER LOGIN
router.post("/login", login);

module.exports = router;
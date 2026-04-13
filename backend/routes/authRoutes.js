// routes/authRoutes.js
const express = require("express");
const router = express.Router();

const { register, login, getMe, logout } = require("../controllers/authController");

// USER REGISTRATION
router.post("/register", register);

// USER LOGIN
router.post("/login", login);

// SESSION CHECK — called by AuthContext on app load
router.get("/auth", getMe);

// LOGOUT — DELETE method destroys session server-side
router.delete("/logout", logout);

module.exports = router;
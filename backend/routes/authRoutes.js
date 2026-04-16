const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  logout,
  getAllUsers
} = require("../controllers/authController");

const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");

// USER REGISTRATION
router.post("/register", register);

// USER LOGIN
router.post("/login", login);

// SESSION CHECK
router.get("/auth", getMe);

// ADMIN — GET ALL USERS
router.get("/users", isAuthenticated, isAdmin, getAllUsers);

// LOGOUT
router.delete("/logout", logout);

module.exports = router;7
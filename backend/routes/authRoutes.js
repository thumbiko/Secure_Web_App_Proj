// routes/authRoutes.js
const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  logout,
  getAllUsers,
  deleteUser
} = require("../controllers/authController");

const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");
const { validateRegister, validateLogin } = require("../middleware/validators");

// USER REGISTRATION
router.post("/register", register);

// USER LOGIN
router.post("/login", login);

// SESSION CHECK
router.get("/auth", getMe);

// ADMIN — GET ALL USERS
router.get("/users", isAuthenticated, isAdmin, getAllUsers);

router.delete("/users/:id", isAuthenticated, isAdmin, deleteUser);

// LOGOUT
router.delete("/logout", logout);

module.exports = router;
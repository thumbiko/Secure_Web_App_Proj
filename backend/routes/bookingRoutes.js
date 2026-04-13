const express = require("express");
const router = express.Router();

const {
  createBooking,
  getUserBookings,
  getAllBookings,
  deleteBooking
} = require("../controllers/bookingController");

const {
  requireLogin,
  requireAdmin
} = require("../middleware/authMiddleware");

// USER ROUTES
router.post("/", requireLogin, createBooking);
router.get("/my", requireLogin, getUserBookings);

// ADMIN ROUTES
router.get("/all", requireLogin, requireAdmin, getAllBookings);
router.delete("/:id", requireLogin, requireAdmin, deleteBooking);

module.exports = router;
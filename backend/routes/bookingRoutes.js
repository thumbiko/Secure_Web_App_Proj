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

// Create a booking (must be logged in)
router.post("/", requireLogin, createBooking);

// Get ONLY my bookings
router.get("/my", requireLogin, getUserBookings);

// ADMIN ROUTES

// View all bookings
router.get("/all", requireAdmin, getAllBookings);

// Delete any booking
router.delete("/:id", requireAdmin, deleteBooking);

module.exports = router;
// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  deleteBooking,
  getAllBookings,
  updateBookingStatus,
  adminDeleteBooking
} = require("../controllers/bookingController");

const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");

// USER ROUTES
router.post("/",      isAuthenticated, createBooking);
router.get("/",       isAuthenticated, getMyBookings);
router.delete("/:id", isAuthenticated, deleteBooking);

// ADMIN ROUTES
router.get("/admin/all",    isAuthenticated, isAdmin, getAllBookings);
router.patch("/admin/:id",  isAuthenticated, isAdmin, updateBookingStatus);
router.delete("/admin/:id", isAuthenticated, isAdmin, adminDeleteBooking);

// ADMIN CREATE BOOKING FOR ANY USER
router.post("/admin/create", isAuthenticated, isAdmin, createBooking);


module.exports = router;
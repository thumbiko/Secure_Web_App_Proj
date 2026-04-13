// controllers/bookingController.js
const Booking = require("../models/Booking");

// =====================
// CREATE BOOKING
// POST /api/bookings
// Automatically attaches user ID from session — stops fake user IDs
// =====================
exports.createBooking = async (req, res) => {
  try {
    const { service, carMake, carModel, carYear, notes, date } = req.body;

    // ── server-side validation ────────────────────────────
    const allowedServices = [
      "starlight_installation", "ambient_lighting", "carplay_kit",
      "valet", "diagnostics", "general_modification"
    ];

    if (!allowedServices.includes(service)) {
      return res.status(400).json({ msg: "Invalid service selected" });
    }
    if (!carMake || !carModel || !carModel.trim()) {
      return res.status(400).json({ msg: "Car details are required" });
    }
    if (!date || new Date(date) < new Date()) {
      return res.status(400).json({ msg: "Please select a future date" });
    }
    if (notes && notes.length > 500) {
      return res.status(400).json({ msg: "Notes must be under 500 characters" });
    }

    const booking = await Booking.create({
      user:     req.session.user.id,
      service,
      carMake:  carMake.trim(),
      carModel: carModel.trim(),
      carYear,
      notes:    notes?.trim() || "",
      date
    });

    res.status(201).json({ msg: "Booking created successfully", booking });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong creating booking" });
  }
};

// =====================
// GET MY BOOKINGS
// GET /api/bookings
// Each user only sees their own bookings
// =====================
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.session.user.id })
      .sort({ date: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: "Could not retrieve bookings" });
  }
};

// =====================
// DELETE MY BOOKING
// DELETE /api/bookings/:id
// User can only delete their own — ownership check prevents horizontal privilege escalation
// =====================
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    // Ownership check — user A cannot delete user B's booking
    if (booking.user.toString() !== req.session.user.id.toString()) {
      return res.status(403).json({ msg: "Not authorised" });
    }

    await booking.deleteOne();
    res.json({ msg: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Could not delete booking" });
  }
};

// =====================
// ADMIN — GET ALL BOOKINGS
// GET /api/bookings/admin/all
// =====================
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email") // join user name + email, no password
      .sort({ date: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: "Could not retrieve bookings" });
  }
};

// =====================
// ADMIN — UPDATE BOOKING STATUS
// PATCH /api/bookings/admin/:id
// =====================
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "completed", "cancelled"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) return res.status(404).json({ msg: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ msg: "Status update failed" });
  }
};

// =====================
// ADMIN — DELETE ANY BOOKING
// DELETE /api/bookings/admin/:id
// =====================
exports.adminDeleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ msg: "Booking not found" });
    res.json({ msg: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Could not delete booking" });
  }
};
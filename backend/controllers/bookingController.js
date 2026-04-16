// controllers/bookingController.js
const Booking = require("../models/Booking");

// CREATE BOOKING (user OR admin assigns user)
exports.createBooking = async (req, res) => {
  try {
    const { service, carMake, carModel, carYear, notes, date, userId } = req.body;

    const allowedServices = [
      "starlight_installation",
      "ambient_lighting",
      "carplay_kit",
      "valet",
      "diagnostics",
      "general_modification"
    ];

    if (!allowedServices.includes(service)) {
      return res.status(400).json({ msg: "Invalid service" });
    }

    if (!carMake || !carModel) {
      return res.status(400).json({ msg: "Car details required" });
    }

    if (!date || new Date(date) < new Date()) {
      return res.status(400).json({ msg: "Invalid date" });
    }

    const assignedUser =
      req.session.user.role === "admin" && userId
        ? userId
        : req.session.user.id;

    const booking = await Booking.create({
      user: assignedUser,
      service,
      carMake,
      carModel,
      carYear,
      notes,
      date
    });

    res.status(201).json(booking);
  } catch {
    res.status(500).json({ msg: "Create booking failed" });
  }
};

// USER BOOKINGS
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.session.user.id })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch {
    res.status(500).json({ msg: "Failed to fetch bookings" });
  }
};

// DELETE OWN
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ msg: "Not found" });

    if (booking.user.toString() !== req.session.user.id) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    await booking.deleteOne();
    res.json({ msg: "Deleted" });
  } catch {
    res.status(500).json({ msg: "Delete failed" });
  }
};

// ADMIN — GET ALL
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch {
    res.status(500).json({ msg: "Failed" });
  }
};

// ADMIN — UPDATE STATUS
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(booking);
  } catch {
    res.status(500).json({ msg: "Update failed" });
  }
};

// ADMIN — DELETE
exports.adminDeleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch {
    res.status(500).json({ msg: "Delete failed" });
  }
};
const Booking = require("../models/Booking");

// CREATE BOOKING
// This lets a logged-in user create a service booking
exports.createBooking = async (req, res) => {
  try {

    // automatically attach user ID from sessionstopping fake user IDs
    const booking = await Booking.create({
      userId: req.session.user.id,
      serviceType: req.body.serviceType,
      vehicleModel: req.body.vehicleModel,
      notes: req.body.notes
    });

    res.status(201).json({
      msg: "Booking created successfully",
      booking
    });

  } catch (error) {
    res.status(500).json({ msg: "Something went wrong creating booking" });
  }
};

// GET USER BOOKINGS
// Each user only sees their own bookings
exports.getUserBookings = async (req, res) => {
  const bookings = await Booking.find({
    userId: req.session.user.id
  });

  res.json(bookings);
};

// ADMIN ONLY - GET ALL BOOKINGS
exports.getAllBookings = async (req, res) => {
  const bookings = await Booking.find().populate("userId", "name email");

  res.json(bookings);
};

// ADMIN ONLY - DELETE BOOKING
exports.deleteBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);

  res.json({
    msg: "Booking deleted successfully"
  });
};
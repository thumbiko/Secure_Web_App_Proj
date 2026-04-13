// server.js
require("dotenv").config(); // must be the very first line

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true  // allows cookies cross-origin
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,   // JS cannot read this cookie — blocks XSS theft
    secure: false,    // set to true in production (requires HTTPS)
    sameSite: "lax",  // prevents CSRF while allowing normal navigation
    maxAge: 1000 * 60 * 60 * 2  // 2 hours
  }
}));

// =====================
// DATABASE
// =====================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// =====================
// ROUTES
// =====================
const authRoutes    = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

app.use("/api/auth",     authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);

// =====================
// GLOBAL ERROR HANDLER
// =====================
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url} —`, err.message);
  res.status(err.statusCode || 500).json({
    message: process.env.NODE_ENV === "production"
      ? "Something went wrong"
      : err.message
  });
});

// =====================
// START SERVER
// =====================
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
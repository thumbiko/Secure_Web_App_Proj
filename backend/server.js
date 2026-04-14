require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const app = express();

/**
 * Rate limiting middleware for authentication endpoints
 * Protects against brute-force login/register attempts
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { msg: "Too many login attempts, please try again later" }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { msg: "Too many registration attempts, please try again later" }
});

/**
 * Core middleware configuration
 */
app.use(express.json({ limit: "10kb" }));

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(mongoSanitize());

/**
 * Session configuration for authentication
 */
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 2
  }
}));

/**
 * Database connection
 */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/**
 * Route imports
 */
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

/**
 * Route mounting
 */
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/register", registerLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url} —`, err.message);

  res.status(err.statusCode || 500).json({
    msg: process.env.NODE_ENV === "production"
      ? "Something went wrong"
      : err.message
  });
});

/**
 * Start server
 */
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
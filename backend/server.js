// server.js
require("dotenv").config();

const express        = require("express");
const mongoose       = require("mongoose");
const cors           = require("cors");
const session        = require("express-session");
const mongoSanitize  = require("express-mongo-sanitize"); // ADD
const rateLimit      = require("express-rate-limit");     // ADD

const app = express();

// =====================
// RATE LIMITER — auth endpoints only
// =====================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 attempts per IP per window
  message: { msg: "Too many attempts, please try again later" }
});

// =====================
// MIDDLEWARE
// =====================
app.use(express.json({ limit: "10kb" })); // body size cap — DoS prevention

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(mongoSanitize()); // strips $ and . from req.body — NoSQL injection prevention

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

// Apply rate limiter to auth routes only
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);

// =====================
// GLOBAL ERROR HANDLER
// =====================
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url} —`, err.message);
  res.status(err.statusCode || 500).json({
    msg: process.env.NODE_ENV === "production"
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
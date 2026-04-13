const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");

const app = express(); // 

// =====================
// MIDDLEWARE
// =====================
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(session({
  secret: "xhausted-secret",
  resave: false,
  saveUninitialized: false
}));

// =====================
// DATABASE
// =====================
//mongoose.connect("mongodb://localhost:27017/xhausted-autos")
mongoose.connect(
  "mongodb+srv://x25234315_db_user:260212@swd.tnl9yrw.mongodb.net/xhausted-autos?retryWrites=true&w=majority"
)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// =====================
// ROUTES
// =====================
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);

// =====================
// TEST ROUTE
// =====================
app.get("/", (req, res) => {
  res.send(" X-Hausted Autos API Running");
});

// =====================
// START SERVER
// =====================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
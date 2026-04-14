// routes/serviceRoutes.js
const express = require("express");
const router = express.Router();

const { getServices, createService } = require("../controllers/serviceController");
const { isAuthenticated, isAdmin }   = require("../middleware/authMiddleware");

// PUBLIC — logged-in users can view services
router.get("/", isAuthenticated, getServices);

// ADMIN ONLY — create new service
router.post("/", isAuthenticated, isAdmin, createService);

module.exports = router;
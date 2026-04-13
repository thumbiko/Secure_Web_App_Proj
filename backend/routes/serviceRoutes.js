const express = require("express");
const router = express.Router();

const {
  getServices,
  createService
} = require("../controllers/serviceController");


const {
  requireLogin,
  requireAdmin
} = require("../middleware/authMiddleware");

// PUBLIC (logged-in users only)
router.get("/", requireLogin, getServices);

// ADMIN ONLY
router.post("/", requireAdmin, createService);

module.exports = router;
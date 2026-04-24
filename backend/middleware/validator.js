const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg });
  }
  next();
};

const validateRegister = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s'-]+$/).withMessage("Name contains invalid characters"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must include at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must include at least one number"),
  validate
];

const validateLogin = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required"),
  validate
];

const validateBooking = [
  body("service")
    .notEmpty().withMessage("Service selection is required")
    .isIn([
      "starlight_installation",
      "ambient_lighting",
      "carplay_kit",
      "valet",
      "diagnostics",
      "general_modification"
    ]).withMessage("Please select a valid service"),
  body("carMake")
    .trim()
    .notEmpty().withMessage("Car make is required")
    .isLength({ max: 50 }).withMessage("Car make must be under 50 characters")
    .matches(/^[a-zA-Z0-9\s\-]+$/).withMessage("Car make contains invalid characters"),
  body("carModel")
    .trim()
    .notEmpty().withMessage("Car model is required")
    .isLength({ max: 50 }).withMessage("Car model must be under 50 characters")
    .matches(/^[a-zA-Z0-9\s\-]+$/).withMessage("Car model contains invalid characters"),
  body("carYear")
    .notEmpty().withMessage("Car year is required")
    .isInt({ min: 1970, max: new Date().getFullYear() + 1 }).withMessage("Please enter a valid car year"),
  body("date")
    .notEmpty().withMessage("Booking date is required")
    .isISO8601().withMessage("Invalid date format")
    .custom((value) => {
      const selected = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) throw new Error("Booking date cannot be in the past");
      return true;
    }),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage("Notes must be under 300 characters"),
  validate
];

const validateStatusUpdate = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["pending", "confirmed", "completed", "cancelled"]).withMessage("Invalid status value"),
  validate
];

module.exports = { validateRegister, validateLogin, validateBooking, validateStatusUpdate };
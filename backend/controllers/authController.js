// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");

// =====================
// REGISTER
// =====================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ msg: "User registered", userId: user._id });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// =====================
// LOGIN
// =====================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    // Store user info in session
    req.session.user = {
      id:   user._id,
      name: user.name,   // added — getMe and Navbar need this
      email: user.email, // added — good practice to have available
      role: user.role
    };

    // Return user object so AuthContext can update immediately
    res.json({
      msg: "Login successful",
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// =====================
// GET ME (session check)
// =====================
exports.getMe = async (req, res) => {
  // Uses req.session.user — consistent with login above
  if (!req.session.user) {
    return res.status(401).json({ msg: "Not authenticated" });
  }

  try {
    const user = await User.findById(req.session.user.id).select("-password");
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }
    res.json(user); // returns { _id, name, email, role }
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// =====================
// LOGOUT
// =====================
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ msg: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ msg: "Logged out successfully" });
  });
};
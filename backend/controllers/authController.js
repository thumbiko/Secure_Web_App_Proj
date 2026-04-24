// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");


// REGISTER

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

    res.status(201).json({
      msg: "User registered",
      userId: user._id
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


// LOGIN

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    // store session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({
      msg: "Login successful",
      user: req.session.user
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


// GET ME

exports.getMe = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ msg: "Not authenticated" });
  }

  try {
    const user = await User.findById(req.session.user.id).select("-password");

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


// LOGOUT

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ msg: "Logout failed" });
    }

    res.clearCookie("connect.sid");
    res.json({ msg: "Logged out successfully" });
  });
};


// ADMIN — GET  USERS 

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email role")
      .sort({ name: 1 });

    res.json(users);

  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch users" });
  }
};



// ADMIN — DELETE USERS

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // prevent deleting self
    if (user._id.toString() === req.session.user.id) {
      return res.status(400).json({ msg: "You cannot delete yourself" });
    }

    await User.findByIdAndDelete(userId);

    res.json({ msg: "User deleted successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Failed to delete user" });
  }
};
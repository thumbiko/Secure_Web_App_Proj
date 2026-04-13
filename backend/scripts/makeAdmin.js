// scripts/makeAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const EMAIL = "bikosubir@gmail.com"; 

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const user = await User.findOneAndUpdate(
      { email: EMAIL },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      console.log("No user found with that email — register first");
    } else {
      console.log(`Done — ${user.email} is now role: ${user.role}`);
    }

    process.exit();
  })
  .catch(err => {
    console.log("DB connection failed:", err.message);
    process.exit(1);
  });
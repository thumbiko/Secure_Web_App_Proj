// scripts/makeAdmin.js
/*require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    // List all users first so we can see what emails exist
    const users = await User.find({}, "name email role");
    console.log("All users:", users);

    process.exit();
  })
  .catch(err => {
    console.log("DB connection failed:", err.message);
    process.exit(1);
  }); */


  // scripts/makeAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const EMAIL = "admin@hotmail.com";

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const user = await User.findOneAndUpdate(
      { email: EMAIL },
      { role: "admin" },
      { returnDocument: "after" }
    );

    if (!user) {
      console.log("No user found — check the email");
    } else {
      console.log(`Done — ${user.email} is now: ${user.role}`);
    }

    process.exit();
  })
  .catch(err => {
    console.log("DB connection failed:", err.message);
    process.exit(1);
  });
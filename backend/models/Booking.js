// models/Booking.js
const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    service: {
      type: String,
      required: true
    },

    carMake: {
      type: String,
      required: true
    },

    carModel: {
      type: String,
      required: true
    },

    carYear: {
      type: Number,
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    notes: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
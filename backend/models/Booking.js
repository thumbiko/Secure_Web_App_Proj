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
      required: true,
      enum: [
        "starlight_installation",
        "ambient_lighting",
        "carplay_kit",
        "valet",
        "diagnostics",
        "general_modification"
      ]
    },
    carMake: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    carModel: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    carYear: {
      type: Number,
      required: true,
      min: 1970,
      max: new Date().getFullYear() + 1
    },
    date: {
      type: Date,
      required: true
    },
    notes: {
      type: String,
      default: "",
      maxlength: 300,
      trim: true
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
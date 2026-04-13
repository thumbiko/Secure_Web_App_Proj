const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  serviceType: {
    type: String,
    enum: [
      "VALET",
      "STEREO",
      "LIGHTING",
      "CARPLAY",
      "DIAGNOSTICS",
      "AMBIENT_LIGHTING",
      "STARC_LIGHTS"
    ],
    required: true
  },

  vehicleModel: {
    type: String,
    required: true
  },

  notes: {
    type: String,
    default: ""
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "completed"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);
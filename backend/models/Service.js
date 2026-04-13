const mongoose = require("mongoose");

// all the services X-Hausted Autos offers
//  lighting, CarPlay, valet.

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: ["LIGHTING", "AUDIO", "VALET", "DIAGNOSTICS", "MODIFICATION"]
  },

  price: {
    type: Number,
    required: true
  },

  description: String
});

module.exports = mongoose.model("Service", ServiceSchema);
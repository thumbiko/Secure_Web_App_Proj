// controllers/serviceController.js
const Service = require("../models/Service");

// GET all services — visible to logged-in users
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ msg: "Could not retrieve services" });
  }
};

// POST create service — admin only
exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ msg: "Service created", service });
  } catch (err) {
    res.status(500).json({ msg: "Could not create service" });
  }
};
const Service = require("../models/Service");

// Get all services (visible to users)
exports.getServices = async (req, res) => {
  const services = await Service.find();
  res.json(services);
};

// Admin creates new services
exports.createService = async (req, res) => {
  const service = await Service.create(req.body);

  res.status(201).json({
    msg: "Service created",
    service
  });
};
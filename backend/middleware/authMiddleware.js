// Check if user is logged in
exports.requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized");
  }
  next();
};

// Check if user is admin
exports.requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).send("Forbidden: Admins only");
  }
  next();
};
// middleware/authMiddleware.js

// Blocks unauthenticated requests — 401 = not logged in
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ msg: "Unauthorised — please log in" });
};

// Blocks non-admin requests — 403 = logged in but not permitted
const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ msg: "Forbidden — admin only" });
};

module.exports = {
  isAuthenticated,
  isAdmin,
  requireLogin: isAuthenticated, // alias — keeps serviceRoutes.js working
  requireAdmin: isAdmin          // alias — keeps serviceRoutes.js working
};
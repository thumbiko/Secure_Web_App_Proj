// Checking if the user is logged in before letting them access anything sensitive

module.exports = {

  // Checks if user is logged in (session exists)
  requireLogin: (req, res, next) => {
    // If there is no session user, block access
    if (!req.session.user) {
      return res.status(401).json({
        msg: "You need to be logged in to access this feature"
      });
    }

    // If user exists, move to next function (controller)
    next();
  },

  // Checks if user is an admin (for protected routes like delete bookings function)
  requireAdmin: (req, res, next) => {

    // First check if user exists
    if (!req.session.user) {
      return res.status(401).json({ msg: "Not logged in" });
    }

    // Then check role
    if (req.session.user.role !== "admin") {
      return res.status(403).json({
        msg: "Only admin users can access this section"
      });
    }

    // If everything is fine, continue
    next();
  }
};
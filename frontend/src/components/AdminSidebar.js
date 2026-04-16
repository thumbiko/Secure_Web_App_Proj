import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();

  const active = (path) =>
    location.pathname === path ? "bg-secondary rounded" : "";

  return (
    <div
      className="bg-dark text-white p-3 vh-100 position-sticky top-0"
      style={{ width: "260px" }}
    >
      <h4 className="mb-4">🚗 Admin Panel</h4>

      {/* OVERVIEW */}
      <small className="text-uppercase text-secondary">Overview</small>
      <Link className={`d-block text-white text-decoration-none p-2 ${active("/admin")}`} to="/admin">
        Dashboard Home
      </Link>
      <Link className="d-block text-white text-decoration-none p-2" to="/admin/calendar">
        Booking Calendar
      </Link>

      <hr className="text-secondary" />

      {/* OPERATIONS */}
      <small className="text-uppercase text-secondary">Operations</small>
      <Link className="d-block text-white text-decoration-none p-2" to="/admin/bookings">
        Booking Management
      </Link>
      <Link className="d-block text-white text-decoration-none p-2" to="/admin/services">
        Service Catalog
      </Link>

      <hr className="text-secondary" />

      {/* USERS */}
      <small className="text-uppercase text-secondary">Users</small>
      <Link className="d-block text-white text-decoration-none p-2" to="/admin/users">
        User Directory
      </Link>
      <Link className="d-block text-white text-decoration-none p-2" to="/admin/staff">
        Staff Management
      </Link>

      <hr className="text-secondary" />

      {/* SECURITY */}
      <small className="text-uppercase text-secondary">Security</small>
      <Link className="d-block text-white text-decoration-none p-2" to="/admin/logs">
        Security Logs
      </Link>
      <Link className="d-block text-white text-decoration-none p-2" to="/admin/api">
        API Status
      </Link>

      <hr className="text-secondary" />

      {/* SETTINGS */}
      <small className="text-uppercase text-secondary">Settings</small>
      <Link className="d-block text-white text-decoration-none p-2" to="/admin/settings">
        App Settings
      </Link>

      <Link className="d-block text-danger text-decoration-none p-2 mt-3" to="/logout">
        Logout
      </Link>
    </div>
  );
}
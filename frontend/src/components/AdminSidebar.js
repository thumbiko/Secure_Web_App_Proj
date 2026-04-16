import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: "260px" }}>
      
      <h4 className="mb-4">🚗 Admin Panel</h4>

      {/* OVERVIEW */}
      <div className="mb-3">
        <small className="text-uppercase text-secondary">Overview</small>
        <Link className={`d-block text-white text-decoration-none mt-2 ${isActive("/admin") ? "fw-bold" : ""}`} to="/admin">
          Dashboard Home
        </Link>
        <Link className="d-block text-white text-decoration-none mt-1" to="/admin/calendar">
          Booking Calendar
        </Link>
      </div>

      {/* OPERATIONS */}
      <div className="mb-3">
        <small className="text-uppercase text-secondary">Operations</small>
        <Link className="d-block text-white text-decoration-none mt-2" to="/admin/bookings">
          Booking Management
        </Link>
        <Link className="d-block text-white text-decoration-none mt-1" to="/admin/pending">
          Pending Approvals
        </Link>
        <Link className="d-block text-white text-decoration-none mt-1" to="/admin/services">
          Service Catalog
        </Link>
      </div>

      {/* USERS */}
      <div className="mb-3">
        <small className="text-uppercase text-secondary">Users</small>
        <Link className="d-block text-white text-decoration-none mt-2" to="/admin/users">
          User Directory
        </Link>
        <Link className="d-block text-white text-decoration-none mt-1" to="/admin/staff">
          Staff Management
        </Link>
        <Link className="d-block text-white text-decoration-none mt-1" to="/admin/roles">
          Role Permissions
        </Link>
      </div>

      {/* SECURITY */}
      <div className="mb-3">
        <small className="text-uppercase text-secondary">Security</small>
        <Link className="d-block text-white text-decoration-none mt-2" to="/admin/logs">
          Security Logs
        </Link>
        <Link className="d-block text-white text-decoration-none mt-1" to="/admin/api-status">
          API Status
        </Link>
      </div>

      {/* SETTINGS */}
      <div className="mb-3">
        <small className="text-uppercase text-secondary">Settings</small>
        <Link className="d-block text-white text-decoration-none mt-2" to="/admin/settings">
          App Settings
        </Link>
        <Link className="d-block text-white text-decoration-none mt-1" to="/admin/profile">
          Profile
        </Link>
      </div>

      <hr className="text-secondary" />

      <Link className="text-danger text-decoration-none" to="/logout">
        Logout
      </Link>
    </div>
  );
}
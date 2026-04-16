import { useEffect, useState } from "react";
import api from "../api/api";

const SERVICE_LABELS = {
  starlight_installation: "Starlight Installation",
  ambient_lighting: "Ambient Lighting",
  carplay_kit: "CarPlay Kit",
  valet: "Valet",
  diagnostics: "Diagnostics",
  general_modification: "General Modification"
};

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"];

const VIEWS = {
  DASHBOARD: "dashboard",
  BOOKINGS: "bookings",
  USERS: "users"
};

export default function AdminDashboard() {
  const [view, setView] = useState(VIEWS.DASHBOARD);

  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // ───────── FETCH DATA ─────────
  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/admin/all");
      setBookings(res.data);
    } catch {
      setError("Failed to load bookings");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/users");
      setUsers(res.data);
    } catch {
      setError("Failed to load users");
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchUsers();
  }, []);

  // ───────── USER ACTIONS ─────────
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/auth/users/${id}`);
      fetchUsers();
    } catch {
      setError("Failed to delete user");
    }
  };

  // ───────── BOOKING ACTIONS ─────────
  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/bookings/admin/${id}`, { status });
      fetchBookings();
    } catch {
      setError("Status update failed");
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Delete booking?")) return;

    try {
      await api.delete(`/bookings/admin/${id}`);
      fetchBookings();
    } catch {
      setError("Failed to delete booking");
    }
  };

  // ───────── COUNTS ─────────
  const counts = bookings.reduce(
    (acc, b) => {
      acc.total += 1;
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    },
    { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
  );

  // ───────── SIDEBAR ─────────
  const Sidebar = () => (
    <div style={{
      width: "220px",
      height: "100vh",
      position: "fixed",
      left: 0,
      top: 0,
      background: "#111",
      color: "#fff",
      padding: "20px"
    }}>
      <h4 className="mb-4">Admin</h4>

      <button className="btn btn-dark w-100 mb-2"
        onClick={() => setView(VIEWS.DASHBOARD)}>
        Dashboard Home
      </button>

      <button className="btn btn-dark w-100 mb-2"
        onClick={() => setView(VIEWS.BOOKINGS)}>
        Booking Management
      </button>

      <button className="btn btn-dark w-100 mb-2"
        onClick={() => setView(VIEWS.USERS)}>
        Users Directory
      </button>
    </div>
  );

  // ───────── DASHBOARD HOME ─────────
  const DashboardHome = () => (
    <div>
      <h2>Dashboard Overview</h2>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card p-3">
            <h6>Total Users</h6>
            <h3>{users.length}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h6>Total Bookings</h6>
            <h3>{counts.total}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h6>Pending Bookings</h6>
            <h3>{counts.pending}</h3>
          </div>
        </div>
      </div>

      {/* SIMPLE CALENDAR VIEW */}
      <div className="card mt-4 p-3">
        <h5>Booking Calendar (Upcoming)</h5>

        {bookings
          .filter(b => b.status !== "cancelled")
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 10)
          .map(b => (
            <div key={b._id} className="border-bottom py-2">
              <strong>{new Date(b.date).toLocaleDateString()}</strong> —{" "}
              {SERVICE_LABELS[b.service]} ({b.carMake} {b.carModel})
            </div>
          ))}
      </div>
    </div>
  );

  // ───────── BOOKINGS ─────────
  const BookingManagement = () => (
    <div>
      <h2>Booking Management</h2>

      {bookings.map(b => (
        <div key={b._id} className="card mb-3 p-3">
          <h5>{SERVICE_LABELS[b.service]}</h5>

          <p>
            {b.carYear} {b.carMake} {b.carModel}
          </p>

          <p className="text-muted">
            {b.user?.name} ({b.user?.email})
          </p>

          <select
            className="form-select mb-2"
            value={b.status}
            onChange={(e) => handleStatusChange(b._id, e.target.value)}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDeleteBooking(b._id)}
          >
            Cancel
          </button>
        </div>
      ))}
    </div>
  );

  // ───────── USERS ─────────
  const UsersDirectory = () => (
    <div>
      <h2>Users Directory</h2>

      {users.map(u => (
        <div key={u._id} className="card mb-2 p-2 d-flex flex-row justify-content-between">
          <div>
            <strong>{u.name}</strong> <br />
            <small>{u.email}</small>
          </div>

          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteUser(u._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <Sidebar />

      <div style={{ marginLeft: "240px", padding: "20px" }}>
        {error && <div className="alert alert-danger">{error}</div>}

        {view === VIEWS.DASHBOARD && <DashboardHome />}
        {view === VIEWS.BOOKINGS && <BookingManagement />}
        {view === VIEWS.USERS && <UsersDirectory />}
      </div>
    </div>
  );
}
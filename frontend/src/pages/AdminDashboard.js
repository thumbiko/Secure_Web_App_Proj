// src/pages/AdminDashboard.js
import { useEffect, useState } from "react";
import api from "../api/api";

const SERVICE_OPTIONS = [
  { value: "starlight_installation", label: "Starlight Installation" },
  { value: "ambient_lighting", label: "Ambient Lighting" },
  { value: "carplay_kit", label: "CarPlay Kit" },
  { value: "valet", label: "Valet" },
  { value: "diagnostics", label: "Diagnostics" },
  { value: "general_modification", label: "General Modification" }
];

const SERVICE_LABELS = Object.fromEntries(
  SERVICE_OPTIONS.map(s => [s.value, s.label])
);

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"];

export default function AdminDashboard() {
  const [tab, setTab] = useState("dashboard");
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

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

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/auth/users/${id}`);
      fetchUsers();
    } catch {
      setError("User delete failed");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/bookings/admin/${id}`, { status });
      fetchBookings();
    } catch {
      setError("Status update failed");
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    try {
      await api.delete(`/bookings/admin/${id}`);
      fetchBookings();
    } catch {
      setError("Delete failed");
    }
  };

  const statusClass = (status) => {
    const map = {
      pending: "warning",
      confirmed: "info",
      completed: "success",
      cancelled: "danger"
    };
    return `badge bg-${map[status]}`;
  };

  const counts = bookings.reduce(
    (acc, b) => {
      acc.total += 1;
      acc.pending += b.status === "pending" ? 1 : 0;
      return acc;
    },
    { total: 0, pending: 0 }
  );

  return (
    <div className="d-flex">

      {/* =======================
          SIDEBAR
      ======================= */}
      <div className="bg-dark text-white p-3" style={{ width: "250px", minHeight: "100vh" }}>
        <h4 className="mb-4">Admin</h4>

        <button className="btn btn-dark w-100 mb-2" onClick={() => setTab("dashboard")}>
          Dashboard
        </button>

        <button className="btn btn-dark w-100 mb-2" onClick={() => setTab("bookings")}>
          Booking Management
        </button>

        <button className="btn btn-dark w-100 mb-2" onClick={() => setTab("calendar")}>
          Booking Calendar
        </button>

        <button className="btn btn-dark w-100 mb-2" onClick={() => setTab("users")}>
          Users
        </button>
      </div>

      {/* =======================
          MAIN CONTENT
      ======================= */}
      <div className="container mt-4">

        {error && <div className="alert alert-danger">{error}</div>}

        {/* =======================
            DASHBOARD HOME
        ======================= */}
        {tab === "dashboard" && (
          <>
            <h2>Dashboard Overview</h2>

            <div className="row mt-4">

              <div className="col-md-4">
                <div className="card text-center">
                  <div className="card-body">
                    <h6>Total Users</h6>
                    <h3>{users.length}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-center">
                  <div className="card-body">
                    <h6>Total Bookings</h6>
                    <h3>{counts.total}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-center">
                  <div className="card-body">
                    <h6>Pending Bookings</h6>
                    <h3>{counts.pending}</h3>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}

        {/* =======================
            BOOKINGS MANAGEMENT
        ======================= */}
        {tab === "bookings" && (
          <>
            <h2>All Bookings</h2>

            {bookings.map(b => (
              <div key={b._id} className="card mb-3">
                <div className="card-body">

                  <h5>{SERVICE_LABELS[b.service]}</h5>
                  <span className={statusClass(b.status)}>{b.status}</span>

                  <p>{b.carYear} {b.carMake} {b.carModel}</p>
                  <p>{b.user?.name} ({b.user?.email})</p>

                  <select
                    className="form-select mb-2"
                    value={b.status}
                    onChange={(e) => handleStatusChange(b._id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteBooking(b._id)}
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))}
          </>
        )}

        {/* =======================
            USERS TAB
        ======================= */}
        {tab === "users" && (
          <>
            <h2>User Directory</h2>

            {users.map(u => (
              <div key={u._id} className="card mb-2">
                <div className="card-body d-flex justify-content-between">
                  <div>
                    {u.name} ({u.email})
                  </div>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteUser(u._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* =======================
            CALENDAR (BASIC)
        ======================= */}
        {tab === "calendar" && (
          <>
            <h2>Booking Calendar</h2>

            {bookings.map(b => (
              <div key={b._id} className="card mb-2">
                <div className="card-body">

                  <strong>{new Date(b.date).toLocaleDateString()}</strong>
                  <p>{SERVICE_LABELS[b.service]}</p>
                  <p>{b.user?.name}</p>

                </div>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}
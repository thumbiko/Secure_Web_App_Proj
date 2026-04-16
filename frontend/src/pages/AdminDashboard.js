// src/pages/AdminDashboard.js
import { useEffect, useState } from "react";
import api from "../api/api";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const SERVICE_LABELS = {
  starlight_installation: "Starlight Installation",
  ambient_lighting: "Ambient Lighting",
  carplay_kit: "CarPlay Kit",
  valet: "Valet",
  diagnostics: "Diagnostics",
  general_modification: "General Modification"
};

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("dashboard"); // sidebar control
  const [error, setError] = useState("");

  // =========================
  // FETCH DATA
  // =========================
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

  // =========================
  // DELETE USER
  // =========================
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/auth/users/${id}`);
      fetchUsers();
    } catch {
      setError("Delete failed");
    }
  };

  // =========================
  // BOOKING ACTIONS
  // =========================
  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/bookings/admin/${id}`, { status });
      fetchBookings();
    } catch {
      setError("Update failed");
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Delete booking?")) return;

    try {
      await api.delete(`/bookings/admin/${id}`);
      fetchBookings();
    } catch {
      setError("Delete failed");
    }
  };

  // =========================
  // COUNTS
  // =========================
  const counts = bookings.reduce(
    (acc, b) => {
      acc.total++;
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    },
    { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
  );

  // =========================
  // BAR CHART DATA
  // =========================
  const chartData = {
    labels: ["Pending", "Confirmed", "Completed", "Cancelled"],
    datasets: [
      {
        label: "Bookings",
        data: [
          counts.pending,
          counts.confirmed,
          counts.completed,
          counts.cancelled
        ]
      }
    ]
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="d-flex">

      {/* =========================
          SIDEBAR
      ========================= */}
      <div className="bg-dark text-white p-3" style={{ width: "250px", minHeight: "100vh" }}>
        <h4>X-Hausted Admin</h4>

        <button className="btn btn-outline-light w-100 mb-2" onClick={() => setView("dashboard")}>
          Dashboard
        </button>

        <button className="btn btn-outline-light w-100 mb-2" onClick={() => setView("bookings")}>
          Booking Management
        </button>

        <button className="btn btn-outline-light w-100 mb-2" onClick={() => setView("calendar")}>
          Booking Calendar
        </button>

        <button className="btn btn-outline-light w-100 mb-2" onClick={() => setView("users")}>
          Users
        </button>
      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <div className="container mt-4">

        {error && <div className="alert alert-danger">{error}</div>}

        {/* =========================
            DASHBOARD HOME
        ========================= */}
        {view === "dashboard" && (
          <>
            <h2>Dashboard Overview</h2>

            <div className="row mb-4">
              <div className="col-md-4">
                <div className="card text-center p-3">
                  <h6>Total Users</h6>
                  <h3>{users.length}</h3>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-center p-3">
                  <h6>Total Bookings</h6>
                  <h3>{counts.total}</h3>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card text-center p-3">
                  <h6>Pending</h6>
                  <h3>{counts.pending}</h3>
                </div>
              </div>
            </div>

            <div className="card p-3">
              <h5>Booking Status Overview</h5>
              <Bar data={chartData} />
            </div>
          </>
        )}

        {/* =========================
            BOOKING MANAGEMENT
        ========================= */}
        {view === "bookings" && (
          <>
            <h2>All Bookings</h2>

            <table className="table table-hover">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Service</th>
                  <th>Car</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td>{b.user?.name}</td>
                    <td>{SERVICE_LABELS[b.service]}</td>
                    <td>{b.carMake} {b.carModel}</td>

                    <td>
                      <select
                        className="form-select"
                        value={b.status}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      >
                        <option>pending</option>
                        <option>confirmed</option>
                        <option>completed</option>
                        <option>cancelled</option>
                      </select>
                    </td>

                    <td>
                      <button className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteBooking(b._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* =========================
            BOOKING CALENDAR (TABLE)
        ========================= */}
        {view === "calendar" && (
          <>
            <h2>Booking Calendar</h2>

            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>User</th>
                  <th>Service</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td>{new Date(b.date).toLocaleDateString()}</td>
                    <td>{b.user?.name}</td>
                    <td>{SERVICE_LABELS[b.service]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* =========================
            USERS TABLE
        ========================= */}
        {view === "users" && (
          <>
            <h2>User Directory</h2>

            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>

                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(u._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

      </div>
    </div>
  );
}
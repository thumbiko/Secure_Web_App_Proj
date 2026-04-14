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

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const [newBooking, setNewBooking] = useState({
    userId: "",
    service: "",
    carMake: "",
    carModel: "",
    carYear: "",
    date: "",
    notes: ""
  });

  // FETCH BOOKINGS
  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/admin/all");
      setBookings(res.data);
    } catch {
      setError("Failed to load bookings");
    }
  };

  // FETCH USERS
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

  // CREATE ADMIN BOOKING (FIXED ROUTE)
  const createAdminBooking = async () => {
    try {
      await api.post("/bookings/admin/create", newBooking);

      setNewBooking({
        userId: "",
        service: "",
        carMake: "",
        carModel: "",
        carYear: "",
        date: "",
        notes: ""
      });

      fetchBookings();
    } catch {
      setError("Failed to create booking");
    }
  };

  const handleChange = (e) => {
    setNewBooking({
      ...newBooking,
      [e.target.name]: e.target.value
    });
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/bookings/admin/${id}`, { status });
      fetchBookings();
    } catch {
      setError("Status update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    try {
      await api.delete(`/bookings/admin/${id}`);
      fetchBookings();
    } catch {
      setError("Delete failed");
    }
  };

  const filtered =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  // ✅ FIXED + IMPROVED COUNTS (THIS IS WHAT YOU ASKED FOR)
  const counts = bookings.reduce(
    (acc, b) => {
      acc.total += 1;
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    },
    {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    }
  );

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
      <h2>Admin Dashboard</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* SUMMARY CARDS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Total", value: counts.total },
          { label: "Pending", value: counts.pending },
          { label: "Confirmed", value: counts.confirmed },
          { label: "Completed", value: counts.completed },
          { label: "Cancelled", value: counts.cancelled }
        ].map((c) => (
          <div key={c.label} style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }}>
            <strong>{c.label}</strong>
            <p>{c.value}</p>
          </div>
        ))}
      </div>

      {/* CREATE BOOKING */}
      <div style={{ padding: 20, border: "1px solid #ddd", marginBottom: 30 }}>
        <h3>Create Booking for User</h3>

        <select name="userId" value={newBooking.userId} onChange={handleChange}>
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        <select name="service" value={newBooking.service} onChange={handleChange}>
          <option value="">Select Service</option>
          {Object.entries(SERVICE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>

        <input name="carMake" placeholder="Car Make" onChange={handleChange} />
        <input name="carModel" placeholder="Car Model" onChange={handleChange} />
        <input name="carYear" placeholder="Year" onChange={handleChange} />
        <input type="date" name="date" onChange={handleChange} />
        <textarea name="notes" placeholder="Notes" onChange={handleChange} />

        <button onClick={createAdminBooking}>Create Booking</button>
      </div>

      {/* FILTER */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {["all", ...STATUS_OPTIONS].map((f) => (
          <button key={f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {/* BOOKINGS */}
      {filtered.map((b) => (
        <div key={b._id} style={{ border: "1px solid #ddd", marginBottom: 10, padding: 10 }}>
          <strong>{SERVICE_LABELS[b.service]}</strong>

          <p>
            {b.carYear} {b.carMake} {b.carModel}
          </p>

          <p>
            {b.user?.name} ({b.user?.email})
          </p>

          <select value={b.status} onChange={(e) => handleStatusChange(b._id, e.target.value)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button onClick={() => handleDelete(b._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
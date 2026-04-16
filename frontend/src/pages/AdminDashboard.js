// src/pages/AdminDashboard.js
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

const CAR_MAKES = ["BMW", "Toyota", "Volkswagen", "Audi", "Ford", "Tesla"];

const CAR_MODELS = {
  BMW: ["1 Series", "3 Series", "5 Series", "X3", "X5"],
  Toyota: ["Corolla", "Yaris", "RAV4"],
  Volkswagen: ["Golf", "Polo", "Passat"],
  Audi: ["A3", "A4", "Q5"],
  Ford: ["Focus", "Puma"],
  Tesla: ["Model 3", "Model Y"]
};

const CAR_YEARS = Array.from({ length: 30 }, (_, i) =>
  String(new Date().getFullYear() - i)
);

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

  const createAdminBooking = async () => {
    try {
      await api.post("/bookings", newBooking);

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

  const counts = bookings.reduce(
    (acc, b) => {
      acc.total += 1;
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    },
    { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Dashboard</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* SUMMARY */}
      <div className="row mb-4">
        {Object.entries(counts).map(([k, v]) => (
          <div key={k} className="col-md-2">
            <div className="card text-center">
              <div className="card-body">
                <h6>{k}</h6>
                <h4>{v}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE BOOKING */}
      <div className="card p-3 mb-4">
        <h5>Create Booking</h5>

        <select className="form-select mb-2" name="userId" value={newBooking.userId} onChange={handleChange}>
          <option value="">Select User</option>
          {users.map(u => (
            <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
          ))}
        </select>

        <select className="form-select mb-2" name="service" value={newBooking.service} onChange={handleChange}>
          <option value="">Select Service</option>
          {Object.entries(SERVICE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        <select className="form-select mb-2" name="carMake" value={newBooking.carMake}
          onChange={(e) => setNewBooking({ ...newBooking, carMake: e.target.value, carModel: "" })}>
          <option value="">Select Make</option>
          {CAR_MAKES.map(m => <option key={m}>{m}</option>)}
        </select>

        <select className="form-select mb-2" name="carModel" value={newBooking.carModel} onChange={handleChange} disabled={!newBooking.carMake}>
          <option value="">Select Model</option>
          {newBooking.carMake && CAR_MODELS[newBooking.carMake].map(m => <option key={m}>{m}</option>)}
        </select>

        <select className="form-select mb-2" name="carYear" value={newBooking.carYear} onChange={handleChange}>
          <option value="">Select Year</option>
          {CAR_YEARS.map(y => <option key={y}>{y}</option>)}
        </select>

        <input type="date" className="form-control mb-2" name="date" onChange={handleChange} />
        <textarea className="form-control mb-2" name="notes" onChange={handleChange} placeholder="Notes" />

        <button className="btn btn-dark" onClick={createAdminBooking}>Create</button>
      </div>

      {/* BOOKINGS */}
      {filtered.map(b => (
        <div key={b._id} className="card mb-3 shadow-sm">
          <div className="card-body">

            <h5>{SERVICE_LABELS[b.service]}</h5>

            <p>{b.carYear} {b.carMake} {b.carModel}</p>
            <p>{b.user?.name} ({b.user?.email})</p>

            {/* ✅ TIMESTAMPS */}
            <p className="text-muted small">Created: {new Date(b.createdAt).toLocaleString()}</p>
            <p className="text-muted small">Updated: {new Date(b.updatedAt).toLocaleString()}</p>

            <select className="form-select mb-2"
              value={b.status}
              onChange={(e) => handleStatusChange(b._id, e.target.value)}>
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>

            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b._id)}>Delete</button>

          </div>
        </div>
      ))}
    </div>
  );
}
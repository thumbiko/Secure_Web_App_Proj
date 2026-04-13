// src/pages/Bookings.js
import { useEffect, useState } from "react";
import api from "../api/api";

// ── dropdown options ──────────────────────────────────────────
const SERVICE_OPTIONS = [
  { value: "starlight_installation", label: "Starlight Installation" },
  { value: "ambient_lighting",       label: "Ambient Lighting" },
  { value: "carplay_kit",            label: "CarPlay Kit" },
  { value: "valet",                  label: "Valet" },
  { value: "diagnostics",            label: "Diagnostics" },
  { value: "general_modification",   label: "General Modification" }
];

const CAR_MAKES = [
  "Audi", "BMW", "Ford", "Honda", "Hyundai",
  "Kia", "Mercedes-Benz", "Nissan", "Toyota",
  "Volkswagen", "Vauxhall", "Skoda", "Other"
];

const CAR_YEARS = Array.from({ length: 30 }, (_, i) =>
  String(new Date().getFullYear() - i)
);

// ── component ────────────────────────────────────────────────
export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  const [form, setForm] = useState({
    service:  "",
    carMake:  "",
    carModel: "",
    carYear:  "",
    date:     "",
    notes:    ""
  });

  // ── fetch user's bookings ──────────────────────────────────
  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data);
    } catch {
      setError("Could not load bookings");
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // ── form field change ──────────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ── submit new booking ─────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/bookings", form);
      setSuccess("Booking created successfully!");
      setForm({ service: "", carMake: "", carModel: "", carYear: "", date: "", notes: "" });
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.msg || "Booking failed");
    }
  };

  // ── cancel booking ─────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      fetchBookings();
    } catch {
      setError("Could not cancel booking");
    }
  };

  // ── status badge colour ────────────────────────────────────
  const statusStyle = (status) => {
    const colours = {
      pending:   { background: "#fff3cd", color: "#856404" },
      confirmed: { background: "#d1ecf1", color: "#0c5460" },
      completed: { background: "#d4edda", color: "#155724" },
      cancelled: { background: "#f8d7da", color: "#721c24" }
    };
    return {
      ...colours[status],
      padding: "2px 10px",
      borderRadius: "12px",
      fontSize: "0.8rem",
      fontWeight: "600"
    };
  };

  // ── render ─────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
      <h2>My Bookings</h2>

      {/* ── feedback messages ── */}
      {error   && <p style={{ color: "red"   }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* ── booking form ── */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "40px" }}>
        <h3>New Booking</h3>

        {/* Service dropdown */}
        <div style={{ marginBottom: "12px" }}>
          <label>Service</label><br />
          <select name="service" value={form.service} onChange={handleChange} required
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}>
            <option value="">-- Select a service --</option>
            {SERVICE_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Car Make dropdown */}
        <div style={{ marginBottom: "12px" }}>
          <label>Car Make</label><br />
          <select name="carMake" value={form.carMake} onChange={handleChange} required
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}>
            <option value="">-- Select make --</option>
            {CAR_MAKES.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        </div>

        {/* Car Model — free text */}
        <div style={{ marginBottom: "12px" }}>
          <label>Car Model</label><br />
          <input
            name="carModel"
            placeholder="e.g. Corolla, Golf, 3 Series"
            value={form.carModel}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>

        {/* Car Year dropdown */}
        <div style={{ marginBottom: "12px" }}>
          <label>Year</label><br />
          <select name="carYear" value={form.carYear} onChange={handleChange} required
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}>
            <option value="">-- Select year --</option>
            {CAR_YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Date picker */}
        <div style={{ marginBottom: "12px" }}>
          <label>Preferred Date</label><br />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split("T")[0]} // no past dates
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>

        {/* Notes */}
        <div style={{ marginBottom: "12px" }}>
          <label>Notes (optional)</label><br />
          <textarea
            name="notes"
            placeholder="Any additional details..."
            value={form.notes}
            onChange={handleChange}
            rows={3}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>

        <button type="submit"
          style={{ padding: "10px 24px", background: "#111", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Book Now
        </button>
      </form>

      {/* ── existing bookings ── */}
      <h3>Your Bookings</h3>

      {bookings.length === 0 && <p>No bookings yet.</p>}

      {bookings.map(b => (
        <div key={b._id} style={{
          border: "1px solid #ddd", borderRadius: "8px",
          padding: "16px", marginBottom: "12px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>{SERVICE_OPTIONS.find(s => s.value === b.service)?.label || b.service}</strong>
            <span style={statusStyle(b.status)}>{b.status}</span>
          </div>
          <p style={{ margin: "8px 0 4px" }}>
            {b.carYear} {b.carMake} {b.carModel}
          </p>
          <p style={{ margin: "4px 0", color: "#666", fontSize: "0.9rem" }}>
            {new Date(b.date).toLocaleDateString("en-IE", { dateStyle: "long" })}
          </p>
          {b.notes && <p style={{ margin: "4px 0", fontSize: "0.9rem" }}>{b.notes}</p>}
          {b.status === "pending" && (
            <button onClick={() => handleDelete(b._id)}
              style={{ marginTop: "8px", padding: "6px 14px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
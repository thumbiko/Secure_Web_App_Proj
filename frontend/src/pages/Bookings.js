import { useEffect, useState } from "react";
import api from "../api/api";

// ── dropdown options ──────────────────────────────────────────
const SERVICE_OPTIONS = [
  { value: "starlight_installation", label: "Starlight Installation" },
  { value: "ambient_lighting", label: "Ambient Lighting" },
  { value: "carplay_kit", label: "CarPlay Kit" },
  { value: "valet", label: "Valet" },
  { value: "diagnostics", label: "Diagnostics" },
  { value: "general_modification", label: "General Modification" }
];

const CAR_MAKES = [
  "BMW", "Toyota", "Volkswagen", "Audi", "Ford", "Tesla"
];

// ✅ NEW — models linked to make
const CAR_MODELS = {
  BMW: ["1 Series", "2 Series", "3 Series", "5 Series", "X1", "X3", "X5"],
  Toyota: ["Corolla", "Yaris", "RAV4", "C-HR"],
  Volkswagen: ["Golf", "Polo", "Tiguan", "Passat"],
  Audi: ["A3", "A4", "A6", "Q3", "Q5"],
  Ford: ["Focus", "Puma", "Kuga"],
  Tesla: ["Model 3", "Model Y", "Model S"]
};

const CAR_YEARS = Array.from({ length: 30 }, (_, i) =>
  String(new Date().getFullYear() - i)
);

// ── component ────────────────────────────────────────────────
export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    service: "",
    carMake: "",
    carModel: "",
    carYear: "",
    date: "",
    notes: ""
  });

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data);
    } catch {
      setError("Could not load bookings");
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // ✅ UPDATED — reset model when make changes
  const handleChange = (e) => {
    if (e.target.name === "carMake") {
      setForm({ ...form, carMake: e.target.value, carModel: "" });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

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

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      fetchBookings();
    } catch {
      setError("Could not cancel booking");
    }
  };

  const statusStyle = (status) => {
    const colours = {
      pending: { background: "#fff3cd", color: "#856404" },
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

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
      <h2>My Bookings</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: "40px" }}>
        <h3>New Booking</h3>

        {/* Service */}
        <select name="service" value={form.service} onChange={handleChange} required>
          <option value="">-- Select a service --</option>
          {SERVICE_OPTIONS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Car Make */}
        <select name="carMake" value={form.carMake} onChange={handleChange} required>
          <option value="">-- Select make --</option>
          {CAR_MAKES.map(make => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>

        {/* ✅ NEW MODEL DROPDOWN */}
        <select
          name="carModel"
          value={form.carModel}
          onChange={handleChange}
          required
          disabled={!form.carMake}
        >
          <option value="">-- Select model --</option>
          {form.carMake &&
            CAR_MODELS[form.carMake].map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
        </select>

        {/* Year */}
        <select name="carYear" value={form.carYear} onChange={handleChange} required>
          <option value="">-- Select year --</option>
          {CAR_YEARS.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {/* Date */}
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          min={new Date().toISOString().split("T")[0]}
        />

        {/* Notes */}
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes..."
        />

        <button type="submit">Book Now</button>
      </form>

      <h3>Your Bookings</h3>

      {bookings.length === 0 && <p>No bookings yet.</p>}

      {bookings.map(b => (
        <div key={b._id}>
          <strong>{b.service}</strong>
          <span style={statusStyle(b.status)}>{b.status}</span>
          <p>{b.carYear} {b.carMake} {b.carModel}</p>
          <p>{new Date(b.date).toLocaleDateString()}</p>

          {b.status === "pending" && (
            <button onClick={() => handleDelete(b._id)}>
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
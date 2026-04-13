// src/pages/AdminDashboard.js
import { useEffect, useState } from "react";
import api from "../api/api";

const SERVICE_LABELS = {
  starlight_installation: "Starlight Installation",
  ambient_lighting:       "Ambient Lighting",
  carplay_kit:            "CarPlay Kit",
  valet:                  "Valet",
  diagnostics:            "Diagnostics",
  general_modification:   "General Modification"
};

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"];

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [error,    setError]    = useState("");
  const [filter,   setFilter]   = useState("all");

  // ── fetch all bookings ────────────────────────────────────
  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/admin/all");
      setBookings(res.data);
    } catch {
      setError("Failed to load bookings — are you logged in as admin?");
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // ── update status ─────────────────────────────────────────
  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/bookings/admin/${id}`, { status });
      fetchBookings();
    } catch {
      setError("Status update failed");
    }
  };

  // ── delete booking ────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    try {
      await api.delete(`/bookings/admin/${id}`);
      fetchBookings();
    } catch {
      setError("Delete failed");
    }
  };

  // ── status badge ──────────────────────────────────────────
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

  // ── filter bookings ───────────────────────────────────────
  const filtered = filter === "all"
    ? bookings
    : bookings.filter(b => b.status === filter);

  // ── summary counts ────────────────────────────────────────
  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = bookings.filter(b => b.status === s).length;
    return acc;
  }, {});

  // ── render ────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
      <h2>Admin Dashboard</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ── summary cards ── */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[{ label: "Total", value: bookings.length, bg: "#f8f9fa" },
          { label: "Pending",   value: counts.pending,   bg: "#fff3cd" },
          { label: "Confirmed", value: counts.confirmed, bg: "#d1ecf1" },
          { label: "Completed", value: counts.completed, bg: "#d4edda" },
          { label: "Cancelled", value: counts.cancelled, bg: "#f8d7da" }
        ].map(card => (
          <div key={card.label} style={{
            background: card.bg, padding: "12px 20px",
            borderRadius: "8px", minWidth: "100px", textAlign: "center"
          }}>
            <div style={{ fontSize: "1.6rem", fontWeight: "700" }}>{card.value}</div>
            <div style={{ fontSize: "0.8rem", color: "#555" }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* ── filter buttons ── */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {["all", ...STATUS_OPTIONS].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: "6px 16px", borderRadius: "20px", border: "1px solid #ccc",
              background: filter === f ? "#111" : "#fff",
              color: filter === f ? "#fff" : "#111",
              cursor: "pointer", textTransform: "capitalize"
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* ── bookings table ── */}
      {filtered.length === 0 && <p>No bookings found.</p>}

      {filtered.map(b => (
        <div key={b._id} style={{
          border: "1px solid #ddd", borderRadius: "8px",
          padding: "16px", marginBottom: "12px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px"
        }}>
          {/* left column */}
          <div>
            <strong>{SERVICE_LABELS[b.service] || b.service}</strong>
            <p style={{ margin: "4px 0", fontSize: "0.9rem" }}>
              {b.carYear} {b.carMake} {b.carModel}
            </p>
            <p style={{ margin: "4px 0", fontSize: "0.9rem", color: "#666" }}>
              {new Date(b.date).toLocaleDateString("en-IE", { dateStyle: "long" })}
            </p>
            {b.notes && (
              <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "#888" }}>{b.notes}</p>
            )}
          </div>

          {/* right column */}
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: "0 0 4px", fontSize: "0.9rem" }}>
              <strong>{b.user?.name}</strong><br />
              <span style={{ color: "#666" }}>{b.user?.email}</span>
            </p>

            <span style={statusStyle(b.status)}>{b.status}</span>

            {/* status change dropdown */}
            <div style={{ marginTop: "8px" }}>
              <select
                value={b.status}
                onChange={e => handleStatusChange(b._id, e.target.value)}
                style={{ padding: "4px 8px", marginRight: "8px" }}>
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <button onClick={() => handleDelete(b._id)}
                style={{
                  padding: "4px 12px", background: "#dc3545",
                  color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer"
                }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
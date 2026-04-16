// src/pages/Bookings.js
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
    const res = await api.get("/bookings");
    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "carMake") {
      setForm({ ...form, carMake: e.target.value, carModel: "" });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/bookings", form);
      setSuccess("Booking created!");
      fetchBookings();
    } catch {
      setError("Booking failed");
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

  return (
    <div className="container mt-5">

      <h2> Bookings</h2>

      {/* =======================
          NEW BOOKING FORM
      ======================= */}
      <div className="card p-3 mb-4">
        <h5>New Booking</h5>

        <form onSubmit={handleSubmit}>
          <select className="form-select mb-2" name="service" onChange={handleChange}>
            <option>Select Service</option>
            {SERVICE_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <select className="form-select mb-2" name="carMake" onChange={handleChange}>
            <option>Select Make</option>
            {CAR_MAKES.map(m => <option key={m}>{m}</option>)}
          </select>

          <select className="form-select mb-2" name="carModel" onChange={handleChange}>
            <option>Select Model</option>
            {form.carMake && CAR_MODELS[form.carMake].map(m => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <select className="form-select mb-2" name="carYear" onChange={handleChange}>
            <option>Select Year</option>
            {CAR_YEARS.map(y => <option key={y}>{y}</option>)}
          </select>

          <input type="date" className="form-control mb-2" name="date" onChange={handleChange} />
          <textarea className="form-control mb-2" name="notes" onChange={handleChange} />

          <button className="btn btn-dark w-100">Book</button>
        </form>
      </div>

      {/* =======================
          👇 THIS IS YOUR NEW ADDITION
      ======================= */}
      <h4 className="mb-3">My Bookings</h4>

      {/* =======================
          BOOKINGS LIST
      ======================= */}
      {bookings.map(b => (
        <div key={b._id} className="card mb-3">
          <div className="card-body">

            <h5>{SERVICE_LABELS[b.service]}</h5>
            <span className={statusClass(b.status)}>{b.status}</span>

            <p>{b.carYear} {b.carMake} {b.carModel}</p>

            <p className="text-muted">
              Created: {new Date(b.createdAt).toLocaleString()}
            </p>

            <p className="text-muted">
              Updated: {new Date(b.updatedAt).toLocaleString()}
            </p>

          </div>
        </div>
      ))}

    </div>
  );
}
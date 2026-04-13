import { useEffect, useState } from "react";
import api from "../api/api";

// Admin dashboard
// Displays ALL bookings in system (admin only)

export default function AdminDashboard() {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await api.get("/bookings/all");
      setBookings(res.data);
    } catch (err) {
      alert("Access denied or server error");
    }
  };

  const deleteBooking = async (id) => {
    await api.delete(`/bookings/${id}`);
    loadBookings();
  };

  return (
    <div className="App">

      <h2>👑 Admin Dashboard</h2>

      {bookings.map((b) => (
        <div className="card" key={b._id}>

          <p><strong>User:</strong> {b.userId?.name}</p>
          <p><strong>Service:</strong> {b.serviceType}</p>
          <p><strong>Car:</strong> {b.vehicleModel}</p>

          <button onClick={() => deleteBooking(b._id)}>
            Delete
          </button>

        </div>
      ))}

    </div>
  );
}
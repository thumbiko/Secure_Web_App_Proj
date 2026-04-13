import { useEffect, useState } from "react";
import api from "../api/api";

// Booking page
// Users can create and view their bookings

export default function Bookings() {

  const [bookings, setBookings] = useState([]);
  const [serviceType, setServiceType] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");

  // Load user bookings
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const res = await api.get("/bookings/my");
    setBookings(res.data);
  };

  const createBooking = async () => {
    await api.post("/bookings", {
      serviceType,
      vehicleModel
    });

    alert("Booking created");
    loadBookings();
  };

  return (
    <div>
      <h2>My Bookings</h2>

      {/* Create booking */}
      <input placeholder="Service Type" onChange={(e) => setServiceType(e.target.value)} />
      <input placeholder="Car Model" onChange={(e) => setVehicleModel(e.target.value)} />

      <button onClick={createBooking}>
        Create Booking
      </button>

      {/* List bookings */}
      <ul>
        {bookings.map((b) => (
          <li key={b._id}>
            {b.serviceType} - {b.vehicleModel}
          </li>
        ))}
      </ul>
    </div>
  );
}
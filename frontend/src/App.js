import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Bookings from "./pages/Bookings";
import AdminDashboard from "./pages/AdminDashboard";

// Main application routing system
// This controls navigation between pages

function App() {
  return (
    <Router>
      <Routes>

        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User feature */}
        <Route path="/bookings" element={<Bookings />} />

        {/* Admin feature */}
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
import { useEffect, useState } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";

// Navbar handles navigation + login state + admin visibility

export default function Navbar() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/auth");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // Logout function
  const logout = async () => {
    await api.delete("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="MainNav">

      <Link to="/">Home</Link>

      {!user && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}

      {user && (
        <>
          <Link to="/bookings">Bookings</Link>

          {/* Admin-only link */}
          {user.role === "admin" && (
            <Link to="/admin">Admin</Link>
          )}

          <button onClick={logout}>
            Logout
          </button>
        </>
      )}

    </nav>
  );
}
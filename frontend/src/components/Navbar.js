// src/components/Navbar.js
import { useEffect, useState } from "react";
import api from "../api/api";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/auth");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [location]);

  const logout = async () => {
    try {
      await api.delete("/auth/logout");
    } catch {
      console.log("Logout error");
    }

    setUser(null);
    navigate("/login");
  };

  // 🔥 helper for active links
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black shadow px-3">
      
      {/* BRAND */}
      <Link className="navbar-brand fw-bold" to="/">
        X-Hausted Autos
      </Link>

      {/* MOBILE TOGGLE */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* NAV ITEMS */}
      <div className="collapse navbar-collapse" id="navbarNav">

        <ul className="navbar-nav ms-auto align-items-lg-center">

          {/* HOME */}
          <li className="nav-item">
            <Link
              className={`nav-link ${isActive("/") ? "active fw-bold" : ""}`}
              to="/"
            >
              Home
            </Link>
          </li>

          {/* NOT LOGGED IN */}
          {!user && (
            <>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/login") ? "active fw-bold" : ""}`}
                  to="/login"
                >
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/register") ? "active fw-bold" : ""}`}
                  to="/register"
                >
                  Register
                </Link>
              </li>
            </>
          )}

          {/* LOGGED IN */}
          {user && (
            <>
              {/* USER NAME */}
              <li className="nav-item me-3">
                <span className="navbar-text text-white">
                  👋 Hi {user.name}
                </span>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/bookings") ? "active fw-bold" : ""}`}
                  to="/bookings"
                >
                  Bookings
                </Link>
              </li>

              {/* ADMIN */}
              {user?.role === "admin" && (
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/admin") ? "active fw-bold" : ""}`}
                    to="/admin"
                  >
                    Admin
                  </Link>
                </li>
              )}

              {/* LOGOUT */}
              <li className="nav-item ms-2">
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            </>
          )}

        </ul>
      </div>
    </nav>
  );
}
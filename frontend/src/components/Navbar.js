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
    } catch (err) {
      console.log("Logout error");
    }

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

          {user?.role === "admin" && (
            <Link to="/admin">Admin</Link>
          )}

          <button onClick={logout}>Logout</button>
        </>
      )}

    </nav>
  );
}
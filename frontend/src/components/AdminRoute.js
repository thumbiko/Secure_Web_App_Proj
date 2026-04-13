import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

// Protects admin-only routes

export function AdminRoute({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/auth");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}
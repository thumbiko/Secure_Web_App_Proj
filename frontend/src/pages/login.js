// src/pages/Login.js
import { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user);
      navigate("/bookings");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto", padding: "0 20px" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "14px" }}>
        <label>Email</label><br />
        <input type="email" placeholder="you@example.com"
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }} />
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label>Password</label><br />
        <input type="password" placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }} />
      </div>

      <button onClick={handleLogin}
        style={{ width: "100%", padding: "10px", background: "#111", color: "#fff",
          border: "none", borderRadius: "6px", cursor: "pointer" }}>
        Login
      </button>

      <p style={{ marginTop: "16px", fontSize: "0.9rem" }}>
        No account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
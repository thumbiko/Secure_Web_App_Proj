// src/pages/Register.js
import { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm]   = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto", padding: "0 20px" }}>
      <h2>Create Account</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {[
          { label: "Name",     name: "name",     type: "text",     placeholder: "Your name" },
          { label: "Email",    name: "email",    type: "email",    placeholder: "you@example.com" },
          { label: "Password", name: "password", type: "password", placeholder: "Min 8 characters" }
        ].map(f => (
          <div key={f.name} style={{ marginBottom: "14px" }}>
            <label>{f.label}</label><br />
            <input name={f.name} type={f.type} placeholder={f.placeholder}
              value={form[f.name]} onChange={handleChange} required
              style={{ width: "100%", padding: "8px", marginTop: "4px" }} />
          </div>
        ))}
        <button type="submit"
          style={{ width: "100%", padding: "10px", background: "#111", color: "#fff",
            border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: "16px", fontSize: "0.9rem" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
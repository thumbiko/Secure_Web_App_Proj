// src/pages/Home.js
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SERVICES = [
  { icon: "✦", name: "Starlight Installation",  desc: "Fibre optic roof lining for a premium night-sky effect" },
  { icon: "◈", name: "Ambient Lighting",         desc: "Custom interior LED ambient lighting systems" },
  { icon: "⊞", name: "CarPlay Kit",              desc: "Wireless Apple CarPlay & Android Auto integration" },
  { icon: "◎", name: "Valet Service",            desc: "Full interior and exterior professional valet" },
  { icon: "⊙", name: "Diagnostics",              desc: "Full OBD2 diagnostic scan and fault report" },
  { icon: "⬡", name: "General Modifications",   desc: "Custom performance and aesthetic modifications" }
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>

      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ fontSize: "2.4rem", marginBottom: "12px" }}>
          X-Hausted Autos
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "24px" }}>
          Premium automotive services — book online in minutes
        </p>
        {user
          ? <Link to="/bookings"
              style={{ padding: "12px 28px", background: "#111", color: "#fff",
                borderRadius: "6px", textDecoration: "none", fontSize: "1rem" }}>
              Book a Service
            </Link>
          : <Link to="/register"
              style={{ padding: "12px 28px", background: "#111", color: "#fff",
                borderRadius: "6px", textDecoration: "none", fontSize: "1rem" }}>
              Get Started
            </Link>
        }
      </div>

      {/* Services grid */}
      <h2 style={{ marginBottom: "20px" }}>Our Services</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
        {SERVICES.map(s => (
          <div key={s.name} style={{
            border: "1px solid #e0e0e0", borderRadius: "10px",
            padding: "20px", background: "#fafafa"
          }}>
            <div style={{ fontSize: "1.6rem", marginBottom: "8px" }}>{s.icon}</div>
            <strong>{s.name}</strong>
            <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "6px" }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
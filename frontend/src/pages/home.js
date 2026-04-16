// src/pages/Home.js
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SERVICES = [
  { name: "Starlight Installation", desc: "Fibre optic roof lighting" },
  { name: "Ambient Lighting", desc: "Interior LED systems" },
  { name: "CarPlay Kit", desc: "Wireless CarPlay install" },
  { name: "Valet", desc: "Full detailing service" },
  { name: "Diagnostics", desc: "OBD fault scanning" },
  { name: "Modifications", desc: "Custom upgrades" }
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1>X-Hausted Autos</h1>
        <p className="text-muted">Premium automotive services</p>

        <Link
          to={user ? "/bookings" : "/register"}
          className="btn btn-dark mt-3"
        >
          {user ? "Book Service" : "Get Started"}
        </Link>
      </div>

      <div className="row g-3">
        {SERVICES.map((s) => (
          <div className="col-md-4" key={s.name}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5>{s.name}</h5>
                <p className="text-muted">{s.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
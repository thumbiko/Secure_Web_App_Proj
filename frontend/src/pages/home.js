// src/pages/Home.js
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// images
import starlight from "../assets/images/services/starlight.jpg";
import ambient from "../assets/images/services/ambient.jpg";
import carplay from "../assets/images/services/carplay.jpg";
import valet from "../assets/images/services/valet.jpg";
import diagnostics from "../assets/images/services/diagnostics.jpg";
import mods from "../assets/images/services/mods.jpg";

const SERVICES = [
  {
    name: "Starlight Installation",
    desc: "Fibre optic roof lighting",
    img: starlight
  },
  {
    name: "Ambient Lighting",
    desc: "Interior LED systems",
    img: ambient
  },
  {
    name: "CarPlay Kit",
    desc: "Wireless CarPlay install",
    img: carplay
  },
  {
    name: "Valet",
    desc: "Full detailing service",
    img: valet
  },
  {
    name: "Diagnostics",
    desc: "OBD fault scanning",
    img: diagnostics
  },
  {
    name: "Modifications",
    desc: "Custom upgrades",
    img: mods
  }
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container py-5">
      {/* HERO SECTION */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">X-Hausted Autos</h1>
        <p className="text-muted">
          Premium automotive services tailored for performance & style
        </p>

        <Link
          to={user ? "/bookings" : "/register"}
          className="btn btn-dark mt-3"
        >
          {user ? "Book Service" : "Get Started"}
        </Link>
      </div>

      {/* SERVICES GRID */}
      <div className="row g-4">
        {SERVICES.map((s) => (
          <div className="col-md-4" key={s.name}>
            <div className="card h-100 shadow-sm border-0">

              {/* IMAGE */}
              <img
                src={s.img}
                className="card-img-top"
                alt={s.name}
                style={{
                  height: "200px",
                  objectFit: "cover"
                }}
              />

              {/* BODY */}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{s.name}</h5>

                <p className="card-text text-muted">
                  {s.desc}
                </p>

                <div className="mt-auto">
                  <Link to="/bookings" className="btn btn-primary btn-sm">
                    Book Now
                  </Link>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// Home page for X-Hausted Autos
// Acts as landing dashboard after login

import { useEffect, useState } from "react";
import api from "../api/api";

export default function Home() {

  const [user, setUser] = useState(null);

  // Check logged-in user on load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/auth");
        setUser(res.data);
      } catch (err) {
        console.log("Not logged in");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="App">

      <h1>🚗 X-Hausted Autos</h1>

      {user ? (
        <h3>Welcome back, {user.name}</h3>
      ) : (
        <h3>Please login to continue</h3>
      )}

      <div className="card">
        <h2>Our Services</h2>
        <p>Starlights • Ambient Lighting • CarPlay • Valet • Diagnostics</p>
      </div>

    </div>
  );
}
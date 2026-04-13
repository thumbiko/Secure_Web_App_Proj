import { useState } from "react";
import api from "../api/api";

// Register page
// Creates and stores new user in db

export default function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", {
        name,
        email,
        password
      });

      alert("User registered successfully");
      window.location.href = "/login";

    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}
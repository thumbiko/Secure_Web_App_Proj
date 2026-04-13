import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      login(res.data.user); 

      navigate("/bookings");

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
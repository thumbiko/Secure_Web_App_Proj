// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";


const AuthContext = createContext(null);

// 2.wraps the whole app, holds the one true user state
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Called once when the app first loads — checks if session exists
  useEffect(() => {
    api.get("/auth/auth")
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Called by Login page immediately after successful login
  const login = (userData) => {
    setUser(userData);
  };

  // Called by Navbar logout button
  const logout = async () => {
    try {
      await api.delete("/auth/logout");
    } catch {
      // still clear local state even if request fails
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook — how every component accesses auth state
export function useAuth() {
  return useContext(AuthContext);
}
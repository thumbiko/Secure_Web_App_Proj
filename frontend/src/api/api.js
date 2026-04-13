// frontend to backend API

import axios from "axios";

// Base URL of backend
export default axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true // allows session cookies
});
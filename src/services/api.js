import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5109", // your backend URL
});

// Attach JWT token automatically
API.interceptors.request.use((req) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
}); 

export default API;
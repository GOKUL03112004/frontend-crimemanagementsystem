import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");
    if (token && role) {
      navigate("/"); // Redirect to landing page, which will handle further redirection
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      

      const res = await API.post("/Auth/Login", {
        email,
        password,
      });

      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("userId", res.data.userID);
      sessionStorage.setItem("role", res.data.role);

      const role = res.data.role;
      if(role === "User")
      {
        navigate("/user-dashboard");
      }
      else if(role === "Officer")
      {
        navigate("/officer-dashboard");
      }
      else if(role === "StationHead")
      {
        navigate("/station-head-dashboard");
      }
      else{
        navigate("/");
      }
    } catch (err) {
      console.log(err)
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 >🛡️ MEIKAAPPU</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="register-text">
          New user?{" "}
          <span onClick={() => navigate("/register")}>
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
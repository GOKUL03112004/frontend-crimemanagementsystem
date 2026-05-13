import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import API from "../services/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/Auth/Login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userID);
      localStorage.setItem("role", res.data.role);

      toast.success("Login successful");

      // Officer Mapping
      if (res.data.role === "Officer") {
        const userId = res.data.userID;

        const officerRes = await API.get(
          `/Officer/GetOfficerByUserId?userId=${userId}`
        );

        localStorage.setItem(
          "officerId",
          officerRes.data.officerId
        );
      }

      // Redirect
      setTimeout(() => {
        switch (res.data.role) {
          case "User":
            navigate("/user-dashboard");
            break;

          case "Officer":
            navigate("/officer-dashboard");
            break;

          case "StationHead":
            navigate("/station-head-dashboard");
            break;

          default:
            navigate("/");
        }
      }, 1200);

    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* LEFT SIDE */}
      <div className="login-brand-section">
        <div className="brand-overlay">
          <h1>MEIKAAPPU</h1>

          <p>
            Smart Crime Management & Investigation System
          </p>

          <div className="brand-features">
            <div className="feature-item">
              <span>●</span>
              <p>Centralized Incident Monitoring</p>
            </div>

            <div className="feature-item">
              <span>●</span>
              <p>Officer Investigation Tracking</p>
            </div>

            <div className="feature-item">
              <span>●</span>
              <p>Secure Evidence Management</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-form-section">
        <div className="login-card">

          <div className="login-header">
            <div className="shield-icon">🛡️</div>

            <h2>Welcome Back</h2>

            <p>Login to continue to the system</p>
          </div>

          <form onSubmit={handleLogin}>

            <div className="input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Authenticating..." : "Login"}
            </button>

          </form>

          <div className="divider"></div>

          <p className="register-text">
            Don't have an account?
            <span onClick={() => navigate("/register")}>
              Register
            </span>
          </p>

        </div>
      </div>

      <ToastContainer position="bottom-right" theme="light" />
    </div>
  );
}

export default Login;
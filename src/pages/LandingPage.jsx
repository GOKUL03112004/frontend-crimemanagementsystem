import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  // Sync with localStorage
  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    syncAuth();

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // Redirect based on role
  const handleDashboardRedirect = () => {
    if (!role) {
      alert("Role not found. Please login again.");
      handleLogout();
      return;
    }

    switch (role) {
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
        alert("Unknown role. Please login again.");
        handleLogout();
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    setToken(null);
    setRole(null);

    navigate("/");
  };

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-section">
          <span>🛡️</span>
          <span>MEIKAAPPU</span>
        </div>

        {/* Buttons */}
        {token ? (
          <div className="nav-buttons">
            <button
              className="login-button"
              onClick={handleDashboardRedirect}
              disabled={!role}
            >
              Go to Dashboard
            </button>

            <button
              className="logout-outline-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="login-button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1>Secure. Centralized. Efficient.</h1>
        <p>
          The next generation of crime management. Track incidents, manage
          evidence, and analyze data with military-grade security protocols.
        </p>

        <div className="hero-btns">
          <a href="#features" className="btn-main">
            System Overview
          </a>
          <a href="#contact" className="btn-outline">
            Contact Admin
          </a>
        </div>
      </header>

      {/* Features */}
      <section className="features-section" id="features">
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Intelligence Analytics</h3>
          <p>
            Real-time data visualization of crime rates and patrol efficiency
            across districts.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📂</div>
          <h3>Case Management</h3>
          <p>
            End-to-end tracking of criminal cases from initial report to court
            resolution.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>High Security</h3>
          <p>
            Multi-factor authentication and role-based access to protect
            sensitive documents.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          &copy; 2026 MEIKAAPPU Crime Management Solutions. Law Enforcement Use
          Only.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
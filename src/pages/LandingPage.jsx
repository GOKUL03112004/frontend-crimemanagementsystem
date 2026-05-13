import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  // Initialize state directly from localStorage to avoid "flash of unauthenticated content"
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));

  const handleLogout = useCallback(() => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    const syncAuth = (e) => {
      // If the storage event was triggered by another tab (logout/login)
      if (e && e.key === null) { // localStorage.clear() was called
        handleLogout();
      } else {
        setToken(localStorage.getItem("token"));
        setRole(localStorage.getItem("role"));
      }
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, [handleLogout]);

  const handleDashboardRedirect = () => {
    if (!token || !role) {
      alert("Session expired or invalid. Please login again.");
      handleLogout();
      return;
    }

    const routes = {
      User: "/user-dashboard",
      Officer: "/officer-dashboard",
      StationHead: "/station-head-dashboard",
    };

    const target = routes[role];
    if (target) {
      navigate(target);
    } else {
      alert("Unauthorized Role Configuration.");
      handleLogout();
    }
  };

  return (
    <div className="landing-page">
      <div className="bg-blur blur-one"></div>
      <div className="bg-blur blur-two"></div>

      <nav className="navbar">
        <div className="logo-section" onClick={() => navigate("/")} style={{cursor: 'pointer'}}>
          <div className="logo-icon">🛡️</div>
          <div>
            <h2>MEIKAAPPU</h2>
            <span>Crime Intelligence Platform</span>
          </div>
        </div>

        <div className="nav-buttons">
          {token ? (
            <>
              <button className="primary-btn" onClick={handleDashboardRedirect}>
                Dashboard
              </button>
              <button className="secondary-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="primary-btn" onClick={() => navigate("/login")}>
              Secure Login
            </button>
          )}
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-tag">NATIONAL DIGITAL INVESTIGATION SYSTEM</p>
          <h1>
            Smart Crime
            <span> Management & Intelligence</span>
          </h1>
          <p className="hero-description">
            A state-of-the-art centralized ecosystem for law enforcement. 
            Streamline evidence tracking, officer coordination, and real-time 
            analytics through a cryptographically secure interface.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn large-btn" onClick={token ? handleDashboardRedirect : () => navigate("/login")}>
              {token ? "Access Dashboard" : "Get Started"}
            </button>
            <a href="#features" className="secondary-btn large-btn">Explore Features</a>
          </div>
        </div>

        <div className="hero-cards">
          <div className="glass-card">
            <h3>98%</h3>
            <p>Case Resolution</p>
          </div>
          <div className="glass-card">
            <h3>AES-256</h3>
            <p>Data Encryption</p>
          </div>
          <div className="glass-card">
            <h3>AI</h3>
            <p>Pattern Analysis</p>
          </div>
        </div>
      </section>

      {/* Features & Other sections remain same, just ensure they use the new CSS variables */}
      <section className="features-section" id="features">
         <div className="section-header">
           <p>CORE FEATURES</p>
           <h2>Advanced Operational Capabilities</h2>
         </div>
         <div className="features-grid">
           <div className="feature-card">
             <div className="feature-icon">📂</div>
             <h3>Incident Management</h3>
             <p>Register, track, and monitor incidents from reporting to final closure.</p>
           </div>
           <div className="feature-card">
             <div className="feature-icon">📊</div>
             <h3>Real-time Analytics</h3>
             <p>Generate heatmaps and operational statistics instantly.</p>
           </div>
           <div className="feature-card">
             <div className="feature-icon">🔒</div>
             <h3>Role-Based Access</h3>
             <p>Strict RBAC protocols for Officers and Station Heads.</p>
           </div>
         </div>
      </section>

      <footer className="footer">
        <p>© 2026 MEIKAAPPU. Authorized Personnel Only. System Monitored.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "./UserDashBoard.css";
import { getRole } from "../../utils/auth";

function UserDashboard() {
  const navigate = useNavigate();

  const role = getRole();

  if (role !== "User") {
    alert("Access denied");
    return <Navigate to="/login" />;
  }

  const dashboardCards = [
    {
      title: "Create Incident",
      description: "Report a new incident securely",
      icon: "📝",
      route: "/create-incident",
      color: "blue",
    },
    {
      title: "My Incidents",
      description: "Track all submitted incidents",
      icon: "📂",
      route: "/user-incidents",
      color: "purple",
    },
    {
      title: "Profile",
      description: "Manage personal information",
      icon: "👤",
      route: "/profile",
      color: "green",
    },
    {
      title: "Change Password",
      description: "Keep your account protected",
      icon: "🔒",
      route: "/change-password",
      color: "orange",
    },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="brand-section" onClick={() => navigate("/")}>
          <div className="brand-icon">🛡️</div>
          <h2>MEIKAAPPU</h2>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item active">
            <span>🏠</span>
            Dashboard
          </div>

          <div
            className="nav-item logout"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            <span>🚪</span>
            Logout
          </div>
        </nav>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Citizen Dashboard</h1>
            <p>
              Access your incident reports, profile settings, and account
              security tools.
            </p>
          </div>

          <div className="status-card">
            <span className="status-dot"></span>
            Secure Session Active
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-content">
            <h2>Public Safety Portal</h2>
            <p>
              Submit incidents, monitor investigation progress, and securely
              manage your account from one centralized platform.
            </p>

            <button onClick={() => navigate("/create-incident")}>
              Create New Incident
            </button>
          </div>

          <div className="welcome-graphic">
            🛡️
          </div>
        </div>

        {/* Cards */}
        <div className="dashboard-grid">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className={`dashboard-card ${card.color}`}
              onClick={() => navigate(card.route)}
            >
              <div className="card-top">
                <div className="card-icon">{card.icon}</div>
              </div>

              <div className="card-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>

              <div className="card-footer">
                <span>Open Module</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;
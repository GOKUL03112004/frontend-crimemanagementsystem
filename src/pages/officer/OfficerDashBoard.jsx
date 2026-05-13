import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "./OfficerDashBoard.css";
import { getRole } from "../../utils/auth";

function OfficerDashboard() {
  const navigate = useNavigate();

  const role = getRole();
  const officerId = localStorage.getItem("officerId");

  // Role Protection
  if (role !== "Officer") {
    alert("Access denied");
    return <Navigate to="/login" />;
  }

  const dashboardCards = [
    {
      title: "My Assignments",
      description: "Manage and investigate assigned incidents",
      icon: "📂",
      route: "/officer/officer-assignments",
      color: "blue",
    },
    {
      title: "Officer Profile",
      description: "View and manage personnel information",
      icon: "👮",
      route: "/profile",
      color: "green",
    },
    {
      title: "Security",
      description: "Update your secure access credentials",
      icon: "🔒",
      route: "/change-password",
      color: "orange",
    },
    {
      title: "Performance",
      description: "Track case resolution and performance analytics",
      icon: "📊",
      route: "/officer/officer-performance",
      color: "purple",
    },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">

        <div
          className="brand-section"
          onClick={() => navigate("/")}
        >
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

      {/* Main Content */}
      <main className="dashboard-main">

        {/* Header */}
        <div className="dashboard-header">

          <div>
            <h1>Officer Control Panel</h1>

            <p>
              Manage assigned investigations, monitor reports,
              and securely access officer tools.
            </p>
          </div>

          <div className="status-card">
            <span className="status-dot"></span>
            Officer Active • #{officerId}
          </div>

        </div>

        {/* Welcome Banner */}
        <div className="welcome-banner">

          <div className="welcome-content">

            <h2>Law Enforcement Operations</h2>

            <p>
              Access assigned cases, monitor investigation updates,
              and manage incident resolution workflows through the
              centralized officer portal.
            </p>

            <button
              onClick={() =>
                navigate("/officer/officer-assignments")
              }
            >
              View Assignments
            </button>

          </div>

          <div className="welcome-graphic">
            🛡️
          </div>

        </div>

        {/* Dashboard Cards */}
        <div className="dashboard-grid">

          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className={`dashboard-card ${card.color}`}
              onClick={() => navigate(card.route)}
            >

              <div className="card-top">
                <div className="card-icon">
                  {card.icon}
                </div>
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

export default OfficerDashboard;
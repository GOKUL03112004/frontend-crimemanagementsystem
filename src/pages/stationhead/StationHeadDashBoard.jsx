import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { getRole } from "../../utils/auth";
import "./StationHeadDashboard.css";

function StationHeadDashboard() {
  const navigate = useNavigate();

  const role = getRole();

  // Role Protection
  if (role !== "StationHead") {
    alert("Access Denied");
    return <Navigate to="/login" />;
  }

  const dashboardCards = [
    {
      title: "User Management",
      description:
        "View, manage, update, and monitor registered citizen accounts.",
      icon: "👥",
      route: "/stationhead/users",
      color: "blue",
    },
    {
      title: "Officer Management",
      description:
        "Manage officer records, assignments, and operational access.",
      icon: "🧑‍✈️",
      route: "/stationhead/officers",
      color: "green",
    },
    {
      title: "Incident Control",
      description:
        "Assign officers, monitor investigations, and update case status.",
      icon: "🚨",
      route: "/stationhead/incidents",
      color: "orange",
    },
    {
      title: "Create Officer",
      description:
        "Add and register new officers into the secured system.",
      icon: "➕",
      route: "/stationhead/create-officer",
      color: "purple",
    },
    {
      title: "Crime Analytics",
      description:
        "Analyze crime trends, patrol efficiency, and operational insights.",
      icon: "📊",
      route: "/stationhead/crime-analytics",
      color: "blue",
    },
    {
      title: "Profile",
      description:
        "View and update your station head profile information.",
      icon: "👤",
      route: "/profile",
      color: "green",
    },
    {
      title: "Security",
      description:
        "Update password and manage secure system access settings.",
      icon: "🔒",
      route: "/change-password",
      color: "orange",
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

      {/* Main */}
      <main className="dashboard-main">

        {/* Header */}
        <div className="dashboard-header">

          <div>
            <h1>Station Head Command Center</h1>

            <p>
              Supervise officers, manage investigations,
              monitor incident operations, and control
              station-level activities securely.
            </p>
          </div>

          <div className="status-card">
            <span className="status-dot"></span>
            System Active • Station Head Access
          </div>

        </div>

        {/* Welcome Banner */}
        <div className="welcome-banner">

          <div className="welcome-content">

            <h2>Centralized Crime Management</h2>

            <p>
              Access real-time operational tools for
              officer deployment, investigation tracking,
              crime analytics, and citizen incident
              management through the unified command portal.
            </p>

            <button
              onClick={() =>
                navigate("/stationhead/incidents")
              }
            >
              Open Incident Control
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

export default StationHeadDashboard;
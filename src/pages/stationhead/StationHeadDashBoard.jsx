import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { getRole } from "../../utils/auth";
import "./StationHeadDashboard.css";

function StationHeadDashboard() {
  const navigate = useNavigate();
  const role = getRole();

  // 🔐 Role Protection
  if (role !== "StationHead") {
    alert("Access Denied");
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <div className="sidebar">
        <h2 onClick={() => navigate("/")}>🛡️MEIKAAPPU</h2>
        <ul>
          <li className="active">Dashboard</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Station Head Dashboard</h1>

        <div className="card-grid">

          {/* USER MANAGEMENT */}
          <div className="feature-card" onClick={() => navigate("/stationhead/users")}>
            <div className="icon">👥</div>
            <h3>User Management</h3>
            <p>View, update, and delete users</p>
          </div>

          {/* OFFICER MANAGEMENT */}
          <div className="feature-card" onClick={() => navigate("/stationhead/officers")}>
            <div className="icon">🧑‍✈️</div>
            <h3>Officer Management</h3>
            <p>Create and manage officers</p>
          </div>

          {/* INCIDENT MANAGEMENT */}
          <div className="feature-card" onClick={() => navigate("/stationhead/incidents")}>
            <div className="icon">🚨</div>
            <h3>Incident Control</h3>
            <p>Assign officers & update status</p>
          </div>

          {/* CREATE OFFICER */}
          <div className="feature-card" onClick={() => navigate("/stationhead/create-officer")}>
            <div className="icon">➕</div>
            <h3>Create Officer</h3>
            <p>Add new officer to system</p>
          </div>

          {/* Profile */}
          <div 
            className="feature-card"
            onClick={() => navigate("/profile")}
          >
            <div className="icon">👤</div>
            <h3>Profile</h3>
            <p>Update your personal details</p>
          </div>

          {/* Change Password */}
          <div 
            className="feature-card"
            onClick={() => navigate("/change-password")}
          >
            <div className="icon">🔒</div>
              <h3>Change Password</h3>
              <p>Update your account password</p>
            </div>

        </div>
      </div>
    </div>
  );
}

export default StationHeadDashboard;
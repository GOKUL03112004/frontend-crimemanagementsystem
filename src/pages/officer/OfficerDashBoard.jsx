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

  return (
    <div className="dashboard-container">
      {/* Sidebar - Consistent with MEIKAAPPU Theme */}
      <div className="sidebar">
        <h2 onClick={() => navigate("/")}>🛡️MEIKAAPPU</h2>
        <ul>
          <li className="active">Dashboard</li>
          <li
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Officer Control Panel</h1>
          <p>Welcome back, Badge ID: <strong>#OFF-{officerId}</strong></p>
        </div>

        <div className="card-grid">
          {/* My Assignments - This redirects to the incidents list */}
          <div 
            className="feature-card"
            onClick={() => navigate("/officer/officer-assignments")} // Change this path to match your route
          >
            <div className="icon">📂</div>
            <h3>My Assignments</h3>
            <p>Manage and update cases assigned to you</p>
          </div>

          {/* Profile */}
          <div 
            className="feature-card"
            onClick={() => navigate("/profile")}
          >
            <div className="icon">👤</div>
            <h3>Officer Profile</h3>
            <p>View and manage your personnel details</p>
          </div>

          {/* Security / Change Password */}
          <div 
            className="feature-card"
            onClick={() => navigate("/change-password")}
          >
            <div className="icon">🔒</div>
            <h3>Security</h3>
            <p>Update your system access password</p>
          </div>

          {/* Analytics / Reports (Placeholder for professional look) */}
          <div className="feature-card disabled">
            <div className="icon">📊</div>
            <h3>Performance</h3>
            <p>Review case resolution analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfficerDashboard;
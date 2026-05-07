import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashBoard.css";
import { getRole } from "../../utils/auth";
import { Navigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();

  const role=getRole();
  if(role!=="User"){
    alert("Access denied")
    return <Navigate to="/login" />;
  }

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <div className="sidebar">
        <h2 onClick={()=>navigate("/")}>🛡️MEIKAAPPU</h2>
        <ul>
          <li className="active">Dashboard</li>
          <li onClick={() => navigate("../profile")}>Profile</li>
          <li onClick={() => {
            sessionStorage.clear();
            navigate("/");
          }}>Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>User Dashboard</h1>

        <div className="card-grid">

          {/* Create Incident */}
          <div 
            className="feature-card"
            onClick={() => navigate("/create-incident")}
          >
            <div className="icon">📝</div>
            <h3>Create Incident</h3>
            <p>Report a new incident quickly</p>
          </div>

          {/* My Incidents */}
          <div 
            className="feature-card"
            onClick={() => navigate("/user-incidents")}
          >
            <div className="icon">📂</div>
            <h3>My Incidents</h3>
            <p>View all your reported incidents</p>
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

export default UserDashboard;
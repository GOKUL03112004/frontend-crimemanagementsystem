import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom"; // Fixed Navigate import
import API from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateOfficer.css";
import { getRole } from "../../utils/auth";

function CreateOfficer() {
  const navigate = useNavigate();
  const role = getRole();
  
  const [formData, setFormData] = useState({
    userId: "",
    rank: ""
  });
  const [loading, setLoading] = useState(false);

  // 🔐 Role Protection
  if (role !== "StationHead") {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/Officer/CreateOfficer", {
        userId: parseInt(formData.userId),
        rank: formData.rank
      });

      toast.success("Officer authorized successfully ✅");
      setFormData({ userId: "", rank: "" });
      
      


    } catch (err) {
      toast.error(err.response?.data?.message || "Authorization failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 onClick={() => navigate("/")}>🛡️MEIKAAPPU</h2>
        <ul>
          <li onClick={() => navigate("/station-head-dashboard")}>Dashboard</li>
          
          
          <li onClick={() => {
            localStorage.clear();
            navigate("/");
          }}>Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1>New Officer </h1>
          <p>Assign to existing users.</p>
        </div>

        <div className="form-wrapper">
          <div className="form-card">
            <div className="card-header">
              <span className="icon">📝</span>
              <h3>Details</h3>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>User ID</label>
                <input
                  type="number"
                  name="userId"
                  placeholder="Enter User ID"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Assigned Rank</label>
                <select
                  name="rank"
                  value={formData.rank}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Rank --</option>
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Authorizing..." : "Assign Officer"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default CreateOfficer;
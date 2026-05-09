import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ChangePassword.css";

function ChangePassword() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Frontend Validation
    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      // 2. API Call (Sending newPassword as a query parameter for Patch)
      await API.patch(`/User/ChangePassword/${userId}?newPassword=${passwords.newPassword}`);
      
      toast.success("Password updated successfully!");
      
      // Redirect to profile or dashboard after success
      
    } catch (err) {
      toast.error(err.response?.data || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-page-container">
      <button className="screen-back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="password-card">
        <div className="password-header">
          <div className="lock-icon">🔒</div>
          <h2>Security Update</h2>
          <p>Update your account password to stay secure.</p>
        </div>

        <form onSubmit={handleSubmit} className="password-form">
          <div className="pw-input-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="••••••••"
              value={passwords.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="pw-input-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={passwords.confirmPassword}
              onChange={handleChange}
              required
            />
            {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
              <span className="error-text">Passwords do not match</span>
            )}
          </div>

          <button type="submit" className="btn-update-pw" disabled={loading}>
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default ChangePassword;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  
  const userId = sessionStorage.getItem("userId");

  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
    role: ""
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await API.get(`/User/GetUser/${userId}`);
      setUser(res.data);
    } catch (err) {
      toast.error("Error fetching user details");
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchUser();
  }, [userId]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await API.put(`/User/UpdateUser/${userId}`, user);
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch {
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-wrapper">
      <button className="screen-back-btn" onClick={() => navigate(-1)}>
      <span className="arrow">←</span> Back
    </button>

    <div className="profile-card">
      <div className="profile-header">
        <div className="header-content">
          <div className="avatar-circle">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <h2>Account Settings</h2>
          <p className="role-badge">{user.role || "Official"}</p>
        </div>
      </div>

        <div className="profile-body">
          <div className="profile-field">
            <label>Full Name</label>
            <input
              type="text"
              className={editing ? "editable" : ""}
              value={user.name}
              disabled={!editing}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>

          <div className="profile-field">
            <label>Email Address</label>
            <input type="email" value={user.email} disabled className="readonly" />
            <small>Email cannot be changed for security reasons.</small>
          </div>

          <div className="profile-field">
            <label>Physical Address</label>
            <textarea
              className={editing ? "editable" : ""}
              value={user.address}
              disabled={!editing}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
            />
          </div>

          <div className="profile-field">
            <label>Phone Number</label>
            <input
              type="text"
              className={editing ? "editable" : ""}
              value={user.phoneNumber}
              disabled={!editing}
              onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
            />
          </div>
        </div>

        <div className="profile-footer">
          {!editing ? (
            <button className="edit-btn" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <div className="action-group">
              <button className="save-btn" onClick={handleUpdate} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button className="cancel-btn" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default Profile;
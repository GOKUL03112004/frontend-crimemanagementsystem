import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UsersPage.css";
import { getRole } from "../../utils/auth";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Search State
  const [searchRole, setSearchRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const role = getRole();

  // 🔐 Role Protection
  if (role !== "StationHead") {
    alert("Access Denied");
    return <Navigate to="/login" />;
  }

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/User/GetAllUsers");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load global user directory");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm permanent removal of this user record?"))
      return;

    try {
      await API.delete(`/User/DeleteUser/${id}`);
      toast.success("User record purged");
      fetchUsers();
    } catch {
      toast.error("Deletion protocol failed");
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      await API.put(
        `/User/UpdateUser/${selectedUser.userId}`,
        selectedUser
      );

      toast.success("User credentials updated successfully");

      setEditMode(false);
      setSelectedUser(null);

      fetchUsers();
    } catch {
      toast.error("System update error");
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter Users by Role
  const filteredUsers = users.filter((u) =>
    u.role.toLowerCase().includes(searchRole.toLowerCase())
  );

  return (
    <div className="admin-users-layout">
      <header className="admin-page-header">
        <div className="header-text">
          <h1>User Directory</h1>
          <p>Personnel Management & Role Authorization Control</p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by role..."
          value={searchRole}
          onChange={(e) => setSearchRole(e.target.value)}
          className="role-search-input"
        />
      </div>

      {loading ? (
        <div className="system-loading">
          Accessing Central Personnel Records...
        </div>
      ) : (
        <div className="admin-table-card">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Identity</th>
                <th>Email Address</th>
                <th>Authorization Role</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.userId}>
                  <td className="id-cell">#{u.userId}</td>

                  <td className="name-cell">
                    <div className="user-avatar-small">
                      {u.name.charAt(0).toUpperCase()}
                    </div>

                    {u.name}
                  </td>

                  <td>{u.email}</td>

                  <td>
                    <span
                      className={`role-badge ${u.role.toLowerCase()}`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="text-right">
                    <div className="action-button-group">
                      <button
                        className="btn-icon view"
                        onClick={() => setSelectedUser(u)}
                        title="View Details"
                      >
                        👁️
                      </button>

                      <button
                        className="btn-icon edit"
                        onClick={() => {
                          setSelectedUser(u);
                          setEditMode(true);
                        }}
                        title="Edit Records"
                      >
                        ✏️
                      </button>

                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(u.userId)}
                        title="Delete Record"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#94a3b8",
                    }}
                  >
                    No users found for this role
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* USER MODAL */}
      {selectedUser && (
        <div
          className="modal-overlay"
          onClick={() => {
            setSelectedUser(null);
            setEditMode(false);
          }}
        >
          <div
            className="admin-modal-window"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div className="modal-title-sec">
                <span className="official-stamp">
                  OFFICIAL REGISTRY
                </span>

                <h2>
                  {editMode
                    ? "Modify Credentials"
                    : "Personnel Details"}
                </h2>
              </div>

              <button
                className="btn-close-x"
                onClick={() => {
                  setSelectedUser(null);
                  setEditMode(false);
                }}
              >
                &times;
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="form-grid">
                <div className="input-group">
                  <label>Full Legal Name</label>

                  <input
                    type="text"
                    className={
                      editMode ? "editable" : "readonly"
                    }
                    value={selectedUser.name}
                    disabled={!editMode}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="input-group">
                  <label>System Email (Primary)</label>

                  <input
                    type="email"
                    className="readonly"
                    value={selectedUser.email}
                    disabled
                  />
                </div>

                <div className="input-group full-width">
                  <label>Residential Address</label>

                  <textarea
                    className={
                      editMode ? "editable" : "readonly"
                    }
                    value={
                      selectedUser.address ||
                      "No address provided"
                    }
                    disabled={!editMode}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        address: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="input-group">
                  <label>Verified Phone</label>

                  <input
                    type="text"
                    className={
                      editMode ? "editable" : "readonly"
                    }
                    value={
                      selectedUser.phoneNumber ||
                      "Not registered"
                    }
                    disabled={!editMode}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="input-group">
                  <label>Assigned Access Role</label>

                  <input
                    type="text"
                    className="readonly"
                    value={selectedUser.role}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              {editMode ? (
                <button
                  className="btn-save-record"
                  onClick={handleUpdate}
                  disabled={isUpdating}
                >
                  {isUpdating
                    ? "Updating..."
                    : "Commit Changes"}
                </button>
              ) : null}

              <button
                className="btn-cancel-record"
                onClick={() => {
                  setSelectedUser(null);
                  setEditMode(false);
                }}
              >
                {editMode ? "Discard" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default UsersPage;
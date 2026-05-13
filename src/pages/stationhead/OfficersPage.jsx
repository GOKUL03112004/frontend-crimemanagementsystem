import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OfficersPage.css";
import { getRole } from "../../utils/auth";

function OfficersPage() {
  const [officers, setOfficers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    rank: "Bronze",
  });

  const role = getRole();

  useEffect(() => {
    fetchOfficers();
  }, []);

  // 🔐 Role Protection
  if (role !== "StationHead") {
    return <Navigate to="/login" replace />;
  }

  
  // Fetch Officers
  const fetchOfficers = async () => {
    try {
      const res = await API.get("/Officer/GetAllOfficers");

      // Safe fallback
      const formattedData = (res.data || []).map((officer) => ({
        ...officer,
        incidents: officer.incidents || [],
        activeCases: officer.activeCases || 0,
      }));

      setOfficers(formattedData);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load officers");
    }
  };

  

  // Start Edit
  const startEdit = (officer) => {
    console.log("Editing Officer:", officer);

    setEditingId(officer.officerId);

    setEditFormData({
      rank: officer.rank || "Bronze",
    });
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditingId(null);

    setEditFormData({
      rank: "Bronze",
    });
  };

  // Update Officer
  const handleUpdate = async (id) => {
    try {
      if (!editFormData.rank) {
        toast.error("Please select a rank");
        return;
      }

      await API.put(
        `/Officer/UpdateOfficer?rank=${editFormData.rank}&id=${id}`
      );

      toast.success("Officer updated successfully ✅");

      setEditingId(null);

      fetchOfficers();
    } catch (err) {
      console.log(err);
      toast.error("Update failed. Please try again.");
    }
  };

  // Sort by active cases
  const sortedOfficers = [...officers].sort(
    (a, b) => b.activeCases - a.activeCases
  );

  return (
    <div className="officers-container">
      {/* Header */}
      <div className="top-bar">
        <div className="title-section">
          <h1>Officer Management</h1>
          <p>Station Personnel & Active Duty Status</p>
        </div>
      </div>

      {/* Cards */}
      <div className="officer-grid">
        {sortedOfficers.map((officer) => (
          <div
            key={officer.officerId}
            className={`officer-card ${
              editingId === officer.officerId ? "editing" : ""
            }`}
          >
            {/* ================= EDIT MODE ================= */}
            {editingId === officer.officerId ? (
              <div className="edit-mode-container">
                <div className="edit-header">
                  <h4>Update Rank</h4>

                  <span className="id-badge">
                    #{officer.officerId}
                  </span>
                </div>

                <div className="edit-user-preview">
                  <div className="mini-avatar">
                    {officer.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3>{officer.name}</h3>
                    <p>{officer.email}</p>
                  </div>
                </div>

                <div className="form-group">
                  <label>Select Rank</label>

                  <select
                    value={editFormData.rank}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        rank: e.target.value,
                      })
                    }
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                  </select>
                </div>

                <div className="edit-actions">
                  <button
                    className="save-btn"
                    onClick={() =>
                      handleUpdate(officer.officerId)
                    }
                  >
                    Save Changes
                  </button>

                  <button
                    className="cancel-btn"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* ================= VIEW MODE ================= */
              <div className="officer-card-inner">
                {/* Sidebar */}
                <div className="officer-sidebar">
                  <div className="profile-avatar">
                    {officer.name?.charAt(0).toUpperCase()}
                  </div>

                  <h3>{officer.name}</h3>

                  <span
                    className={`rank-tag ${officer.rank?.toLowerCase()}`}
                  >
                    {officer.rank}
                  </span>

                  <button
                    type="button"
                    className="edit-trigger"
                    onClick={() => startEdit(officer)}
                  >
                    Edit Rank
                  </button>
                </div>

                {/* Main */}
                <div className="officer-main-content">
                  <div className="content-header">
                    <div className="stat-box">
                      <span className="stat-num">
                         {officer.activeCases}
                      </span>

                      <span className="stat-label">
                        Active Cases
                      </span>
                    </div>

                    <span className="officer-id-text">
                      Ref: #{officer.officerId}
                    </span>
                  </div>

                  <div className="incident-block">
                    <h4>Assigned Incidents</h4>

                    <div className="incident-list-compact">
                      {officer.incidents.length > 0 ? (
                        officer.incidents.map((incident) => (
                          <div
                            key={incident.incidentId}
                            className="incident-row"
                          >
                            <span className="inc-ref">
                              #{incident.incidentId}
                            </span>

                            <span
                              className={`inc-status-dot ${incident.status
                                ?.toLowerCase()
                                .replace(/\s/g, "")}`}
                            >
                              {incident.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="empty-msg">
                          No active assignments
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default OfficersPage;
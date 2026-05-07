import React, { useEffect, useState, Navigate } from "react";
import API from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OfficersPage.css";
import { getRole } from "../../utils/auth";

function OfficersPage() {
  const [officers, setOfficers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ userId: "", rank: "" });

  // State for Editing
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({rank: "" });

  const fetchOfficers = async () => {
    try {
      const res = await API.get("/Officer/GetAllOfficers");
      setOfficers(res.data);
    } catch {
      toast.error("Failed to load officers");
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  const role = getRole();
  
    // 🔐 Role Protection
    if (role !== "StationHead") {
      alert("Access Denied");
       <Navigate to="/login" />;
    }

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = { userId: Number(formData.userId), rank: formData.rank };
      await API.post("/Officer/CreateOfficer", payload);
      toast.success("Officer created successfully ✅");
      setFormData({ userId: "", rank: "" });
      setShowForm(false);
      fetchOfficers();
    } catch (err) {
      toast.error(err.response?.data?.Message || "Error creating officer");
    }
  };

  // 🔹 Start Editing
  const startEdit = (officer) => {
    setEditingId(officer.officerId);
    setEditFormData({  rank: officer.rank });
  };

  // 🔹 Handle Update (PUT)
  const handleUpdate = async (id) => {
    try {
      const payload = {
        rank: editFormData.rank
      };
      
      // matches your [HttpPut("UpdateOfficer")]
      const res = await API.put(`/Officer/UpdateOfficer?rank=${payload.rank}&id=${id}`);
      
      toast.success(res.data.Message || "Officer updated successfully");
      setEditingId(null);
      fetchOfficers();
    } catch (err) {
        console.log(err)
      toast.error("Update failed. Check if User ID exists.");
    }
  };

  return (
    <div className="officers-container">
      <div className="top-bar">
        <div className="title-section">
          <h1>Officer Details</h1>
          <p>Manage ranks and active assignments</p>
        </div>
        
      </div>

      

      <div className="officer-grid">
        {officers.map((officer) => (
          <div key={officer.officerId} className={`officer-card ${editingId === officer.officerId ? "editing" : ""}`}>
            {editingId === officer.officerId ? (
              // 📝 EDIT MODE UI
              <div className="edit-mode-container">
                <h4>Editing Officer #{officer.officerId}</h4>
                
                <div className="form-group">
                    <label>Rank</label>
                    <select 
                        value={editFormData.rank} 
                        onChange={(e) => setEditFormData({...editFormData, rank: e.target.value})}
                    >
                        <option value="Bronze">Bronze</option>
                        <option value="Silver">Silver</option>
                        <option value="Gold">Gold</option>
                    </select>
                </div>
                <div className="edit-actions">
                    <button className="save-btn" onClick={() => handleUpdate(officer.officerId)}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              // 🛡️ VIEW MODE UI
              <>
                <div className="officer-header">
                  <div className="officer-info">
                    <h3>{officer.name}</h3>
                    <span className={`rank-badge ${officer.rank.toLowerCase()}`}>
                      {officer.rank}
                    </span>
                  </div>
                  <button className="edit-icon-btn" onClick={() => startEdit(officer)}>✏️</button>
                </div>

                <div className="officer-stats">
                    <p><strong>Officer ID:</strong> {officer.officerId}</p>
                    <p><strong>Active Cases:</strong> {officer.activeCases}</p>
                </div>

                <div className="incident-section">
                  <h4>Assigned Incidents</h4>
                  <div className="incident-scroll-list">
                    {officer.incidents.map((i) => (
                      <div key={i.incidentId} className="incident-item">
                        <span className="inc-id">#INC-{i.incidentId}</span>
                        <span className={`inc-status ${i.status.toLowerCase()}`}>{i.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default OfficersPage;
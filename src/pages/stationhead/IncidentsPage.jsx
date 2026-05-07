import React, { useEffect, useState,Navigate } from "react";
import API from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./IncidentsPage.css";
import {getRole} from "../../utils/auth"

function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [fullIncident, setFullIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  const [assignData, setAssignData] = useState({}); 
  const [statusData, setStatusData] = useState({});

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/Incident/GetAllIncidents");
      setIncidents(res.data);
    } catch {
      toast.error("Failed to load global incidents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const role = getRole();
  
    // 🔐 Role Protection
    if (role !== "StationHead") {
      alert("Access Denied");
      return <Navigate to="/login" />;
    }
  const handleAssign = async (incidentId) => {
    const officerId = assignData[incidentId];
    if (!officerId) {
      toast.warn("Enter a valid Officer ID");
      return;
    }

    try {
      await API.put("/Incident/AssignOfficer", {
        incidentId: incidentId,
        officerId: Number(officerId)
      });
      toast.success("Officer assigned successfully");
      setAssignData({ ...assignData, [incidentId]: "" });
      fetchIncidents();
    } catch (err) {
      toast.error(err.response?.data?.Message || "Assignment failed");
    }
  };

  const handleStatusUpdate = async (id) => {
    const status = statusData[id];
    if (!status) {
      toast.warn("Select a status");
      return;
    }

    try {
      await API.put(`/Incident/UpdateIncidentStatus/${id}?status=${status}`);
      toast.success("Case status updated");
      fetchIncidents();
    } catch (err) {
      toast.error(err.response?.data?.Details || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm deletion of this official record?")) return;
    try {
      await API.delete(`/Incident/DeleteIncident/${id}`);
      toast.success("Incident purged from records");
      fetchIncidents();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleView = async (id) => {
    try {
      const res = await API.get(`/Incident/GetIncidentById/${id}`);
      setFullIncident(res.data);
    } catch {
      toast.error("Failed to fetch full report");
    }
  };

  const handleDownloadPdf = async (id) => {
    try {
      const response = await API.get(`/Incident/DownloadPdf/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Incident_Report_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("PDF generation failed");
    }
  };

  return (
    <div className="admin-incidents-layout">
      <header className="admin-header">
        <h1>Incident Control Panel</h1>
        <p>Monitor assignments and update case statuses.</p>
      </header>

      {loading ? (
        <div className="system-loading">Accessing Central Registry...</div>
      ) : (
        <div className="admin-incident-grid">
          {incidents.map((incident) => (
            <div key={incident.incidentId} className="admin-incident-card">
              <div className="card-top-info">
                <span className="case-id">#INC-{incident.incidentId}</span>
                <span className={`status-pill ${incident.status?.toLowerCase()}`}>
                  {incident.status}
                </span>
              </div>

              <h3>{incident.title}</h3>
              
              <div className="personnel-info-box">
                <div className="info-line">
                  <strong>Reporter:</strong> {incident.userName}
                </div>
                <div className="info-line">
                  <strong>Officer:</strong> {incident.officerName || "Unassigned"} 
                  {incident.officerId && <span className="id-badge"> (ID: {incident.officerId})</span>}
                </div>
              </div>

              <div className="admin-action-row">
                <input
                  type="number"
                  placeholder="Officer ID"
                  value={assignData[incident.incidentId] || ""}
                  disabled={incident.status === "Closed" || incident.status === "Verified"}
                  onChange={(e) => setAssignData({ ...assignData, [incident.incidentId]: e.target.value })}
                />
                <button 
                   className="btn-assign"
                   onClick={() => handleAssign(incident.incidentId)}
                   disabled={incident.status === "Closed" || incident.status === "Verified"}
                >
                  Assign
                </button>
              </div>

              <div className="admin-action-row">
                <select
                  value={statusData[incident.incidentId] || ""}
                  disabled={incident.status === "Verified"}
                  onChange={(e) => setStatusData({ ...statusData, [incident.incidentId]: e.target.value })}
                >
                  <option value="">Update Status</option>
                  <option value="Closed">Closed</option>
                  <option value="Verified">Verified</option>
                </select>
                <button 
                  className="btn-update"
                  onClick={() => handleStatusUpdate(incident.incidentId)}
                  disabled={incident.status === "Verified"}
                >
                  Update
                </button>
              </div>

              <div className="card-final-actions">
                <button className="btn-view" onClick={() => handleView(incident.incidentId)}>View Report</button>
                <button className="btn-delete" onClick={() => handleDelete(incident.incidentId)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL --- */}
      {fullIncident && (
        <div className="modal-overlay" onClick={() => setFullIncident(null)}>
          <div className="report-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-sec">
              <span className="official-stamp">OFFICIAL RECORD</span>
              <h2>{fullIncident.title}</h2>
              <button className="close-x" onClick={() => setFullIncident(null)}>&times;</button>
            </div>

            <div className="modal-scroll-content">
              <div className="report-grid-layout">
                <div className="report-box">
                  <h4>Incident Data</h4>
                  <p><strong>Type:</strong> {fullIncident.incidentType}</p>
                  <p><strong>Status:</strong> {fullIncident.status}</p>
                  <p><strong>Description:</strong> {fullIncident.description}</p>
                </div>

                <div className="report-box">
                  <h4>Personnel Details</h4>
                  <p><strong>Reporter Name:</strong> {fullIncident.userName}</p>
                  <p><strong>Officer Name:</strong> {fullIncident.officerName || "N/A"}</p>
                  <p><strong>Officer ID:</strong> {fullIncident.officerId || "Not Assigned"}</p>
                </div>
              </div>

              {fullIncident.imagePath && (
                <div className="report-evidence">
                  <h4>Evidence Media</h4>
                  <img src={`http://localhost:5109${fullIncident.imagePath}`} alt="Evidence" />
                </div>
              )}
            </div>

            <div className="modal-footer-sec">
              <button className="btn-download-pdf" onClick={() => handleDownloadPdf(fullIncident.incidentId)}>
                Download PDF
              </button>
              <button className="btn-close-modal" onClick={() => setFullIncident(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default IncidentsPage;
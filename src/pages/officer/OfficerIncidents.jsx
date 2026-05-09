import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate, Navigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OfficerDashBoard.css";
import { getRole } from "../../utils/auth";

function OfficerDashboard() {
  const navigate = useNavigate();
  const officerId = localStorage.getItem("officerId");
  const role = getRole();

  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (officerId) fetchAssignedIncidents();
  }, [officerId]);

  // Role Protection
  if (role !== "Officer") {
    alert("Access Denied");
    return <Navigate to="/login" />;
  }

  const fetchAssignedIncidents = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/Incident/GetIncidentsByOfficer/${officerId}`);
      setIncidents(res.data);
    } catch (err) {
      toast.error("Failed to load assigned investigations");
    } finally {
      setLoading(false);
    }
  };

  

  const handleStatusUpdate = async (id) => {
    try {
      // Officers can only mark as 'Closed' according to backend logic
      await API.put(`/Incident/UpdateIncidentStatus/${id}?status=Closed`);
      toast.success("Investigation finalized. Case marked as Closed.");
      fetchAssignedIncidents();
    } catch (err) {
      toast.error(err.response?.data?.Details || "Unauthorized status change");
    }
  };

  const handleView = async (id) => {
    try {
      const res = await API.get(`/Incident/GetIncidentById/${id}`);
      setSelectedIncident(res.data);
    } catch {
      toast.error("Failed to access incident file");
    }
  };

  const handleDownloadPdf = async (id) => {
    try {
      const response = await API.get(`/Incident/DownloadPdf/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Officer_Report_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("PDF Downloaded");
    } catch {
      toast.error("PDF generation failed");
    }
  };

  

  return (
    <div className="officer-dashboard-layout">
      {/* Sidebar - Matches StationHead Theme */}
      <div className="officer-sidebar">
        <h2 onClick={() => navigate("/")}>🛡️ MEIKAAPPU</h2>
        <ul>
          <li className="active">Assigned Cases</li>
          <li onClick={() => { localStorage.clear(); navigate("/"); }}>Logout</li>
        </ul>
      </div>

      <div className="officer-main-content">
        <header className="officer-header">
          <h1>Officer Investigation Portal</h1>
          <p>Badge ID: <strong>#OFF-{officerId}</strong> | Manage your assigned case files.</p>
        </header>

        {loading ? (
          <div className="system-loading">Accessing Assigned Files...</div>
        ) : (
          <div className="officer-incident-grid">
            {incidents.map((incident) => (
              <div key={incident.incidentId} className="officer-incident-card">
                <div className="card-top-info">
                  <span className="case-id">#INC-{incident.incidentId}</span>
                  <span className={`status-pill ${incident.status?.toLowerCase()}`}>
                    {incident.status}
                  </span>
                </div>

                <h3>{incident.title}</h3>
                
                <div className="personnel-info-box">
                  <div className="info-line">
                    <strong>Complainant:</strong> {incident.userName}
                  </div>
                  <div className="info-line">
                    <strong>Reporter ID:</strong> <span className="id-badge">#{incident.userId}</span>
                  </div>
                </div>

                <div className="card-final-actions">
                  <button className="btn-view" onClick={() => handleView(incident.incidentId)}>Open File</button>
                  <button className="btn-pdf" onClick={() => handleDownloadPdf(incident.incidentId)}>PDF</button>
                  
                  {incident.status === "Active" && (
                    <button className="btn-close-case" onClick={() => handleStatusUpdate(incident.incidentId)}>
                      Finalize & Close
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- SHARED THEME MODAL --- */}
      {selectedIncident && (
        <div className="modal-overlay" onClick={() => setSelectedIncident(null)}>
          <div className="report-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-sec">
              <span className="official-stamp">OFFICIAL OFFICER RECORD</span>
              <h2>{selectedIncident.title}</h2>
            </div>
            <button className="close-x" onClick={() => setSelectedIncident(null)}>&times;</button>

            <div className="modal-scroll-content">
              <div className="report-grid-layout">
                <div className="report-box">
                  <h4>Investigation Details</h4>
                  <p><strong>Category:</strong> {selectedIncident.incidentType}</p>
                  <p><strong>Filing Date:</strong> {new Date(selectedIncident.createdDate).toLocaleDateString()}</p>
                  <p><strong>Narrative:</strong> {selectedIncident.description}</p>
                </div>

                <div className="report-box">
                  <h4>Subject Details</h4>
                  <p><strong>Name:</strong> {selectedIncident.userName}</p>
                  <p><strong>Email:</strong> {selectedIncident.userEmail}</p>
                  <p><strong>Case Status:</strong> {selectedIncident.status}</p>
                </div>
              </div>

              {selectedIncident.imagePath && (
                <div className="report-evidence">
                  <h4>Evidence Media</h4>
                  <img src={`http://localhost:5109${selectedIncident.imagePath}`} alt="Evidence" />
                </div>
              )}
            </div>

            <div className="modal-footer-sec">
              <button className="btn-download-pdf" onClick={() => handleDownloadPdf(selectedIncident.incidentId)}>
                Download PDF
              </button>
              <button className="btn-close-modal" onClick={() => setSelectedIncident(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" theme="light" />
    </div>
  );
}

export default OfficerDashboard;
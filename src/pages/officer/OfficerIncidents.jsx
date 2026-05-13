import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate, Navigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OfficerIncidents.css"; // We will update this CSS next
import { getRole } from "../../utils/auth";

function OfficerIncident() {
  const navigate = useNavigate();
  const officerId = localStorage.getItem("officerId");
  const role = getRole();

  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (officerId) fetchAssignedIncidents();
  }, [officerId]);

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
      // Officers mark as Closed
      await API.put(`/Incident/UpdateIncidentStatus/${id}?status=Closed`);
      toast.success("Investigation finalized and marked as Closed");
      fetchAssignedIncidents(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.Details || "Failed to update status");
    }
  };

  const handleView = async (id) => {
  try {

    const res = await API.get(
      `/Incident/GetIncidentById/${id}`
    );

    setSelectedIncident(res.data);

  } catch (err) {

    toast.error("Failed to load incident details");
  }
};

  const handleDownloadPdf = async (incidentId) => {
    try {
      toast.info("Generating official officer report...");
      const response = await API.get(`/Incident/DownloadPdf/${incidentId}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `Officer_Report_INC-${incidentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      toast.error("PDF generation failed");
    }
  };

  return (
    <div className="incidents-page-container officer-portal">
      <header className="incidents-header">
        <div className="header-flex-row">
           <div>
              <h2>Investigation Dashboard</h2>
              <p>Badge ID: <strong>#OFF-{officerId}</strong> | Managing assigned cases</p>
           </div>
           <button className="btn-logout-minimal" onClick={() => { localStorage.clear(); navigate("/"); }}>
             Logout System
           </button>
        </div>
      </header>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Accessing Secure Investigation Files...</p>
        </div>
      ) : (
        <div className="incidents-grid">
          {incidents.length > 0 ? (
            incidents.map((incident) => (
              <div key={incident.incidentId} className="incident-summary-card officer-card">
                <div className="card-top-row">
                  <span className="case-number">#INC-{incident.incidentId}</span>
                  <span className={`status-tag ${incident.status.toLowerCase()}`}>
                    {incident.status}
                  </span>
                </div>
                <h3>{incident.title}</h3>
                <div className="mini-info-box">
                    <p><strong>Complainant:</strong> {incident.userName}</p>
                    <p><strong>Type:</strong> {incident.incidentType}</p>
                </div>
                <button 
                  className="btn-open-report" 
                  onClick={() => handleView(incident.incidentId)}
                >
                  Open Case File
                </button>
              </div>
            ))
          ) : (
            <div className="empty-logs">
              <p>No investigations currently assigned to your badge.</p>
            </div>
          )}
        </div>
      )}

      {/* --- OFFICER MODAL --- */}
      {selectedIncident && (
        <div className="report-modal-overlay" onClick={() => setSelectedIncident(null)}>
          <div className="report-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-sec officer-theme">
              <div className="header-labels">
                <span className="official-text">OFFICIAL POLICE RECORD</span>
                <h2>{selectedIncident.title}</h2>
              </div>
              <button className="btn-close-x" onClick={() => setSelectedIncident(null)}>&times;</button>
            </div>

            <div className="modal-scroll-body">
              <div className="info-row">

  <div className="info-block">
    <label>Complainant Name</label>

    <div className="data-display highlight">
      {selectedIncident.userName}
    </div>
  </div>

  <div className="info-block">
    <label>Complainant ID</label>

    <div className="data-display">
      {selectedIncident.userID}
    </div>
  </div>

</div>

<div className="info-row">

  <div className="info-block">
    <label>Incident Type</label>

    <div className="data-display">
      {selectedIncident.incidentType}
    </div>
  </div>

  <div className="info-block">
    <label>Current Status</label>

    <div className="data-display">
      {selectedIncident.status}
    </div>
  </div>

</div>
<div className="info-block">

                <label>
                  Incident Evidence / Description
                </label>

                <div className="description-box-final">
                  {
                    selectedIncident.description
                  }
                </div>

              </div>

              {selectedIncident.imagePath && (
                <div className="info-block">
                  <label>Evidence Media</label>
                  <div className="evidence-media-preview">
                     <img src={`http://localhost:5109${selectedIncident.imagePath}`} alt="Evidence" />
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer-sec">
              {selectedIncident.status === "Active" && (
                <button className="btn-finalize" onClick={() => handleStatusUpdate(selectedIncident.incidentId)}>
                  Finalize & Close Case
                </button>
              )}
              <button className="btn-print" onClick={() => handleDownloadPdf(selectedIncident.incidentId)}>
                Export PDF
              </button>
              <button className="btn-close-final" onClick={() => setSelectedIncident(null)}>
                Return
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
}

export default OfficerIncident;
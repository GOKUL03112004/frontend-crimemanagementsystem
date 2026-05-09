import React, { useEffect, useState,Navigate } from "react";
import API from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./GetAllIncident.css";
import { getRole } from "../../utils/auth";

function GetAllIncident() {
  // Use localStorage to stay consistent with your Login/Profile logic
  const userId = localStorage.getItem("userId");
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await API.get(`/Incident/GetAllIncidentsForUser/${userId}`);
        setIncidents(res.data);
      } catch (err) {
        toast.error("Failed to load incident records");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchIncidents();
  }, [userId]);

  const role=getRole()
    if(role!=="User"){
      alert("Access denied")
      return <Navigate to="/login" />;
    }

  const closeReport = () => setActiveReport(null);

  const handleDownloadPdf = async (incidentId) => {
  try {
    toast.info("Preparing your official report...", { autoClose: 1000 });

    // 1. Fetch from backend with responseType 'blob'
    const response = await API.get(`/Incident/DownloadPdf/${incidentId}`, {
      responseType: 'blob', // CRITICAL: This tells Axios not to parse as JSON
    });

    // 2. Create a Blob URL from the response data
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);

    // 3. Create a temporary anchor element
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    // Set the filename (matches your backend naming convention)
    link.setAttribute('download', `Incident_${incidentId}.pdf`);

    // 4. Append to body, trigger click, and remove
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    toast.success("Download started successfully");
  } catch (err) {
    console.error("PDF Download Error:", err);
    toast.error("Failed to generate PDF. Please try again later.");
  }
};

  return (
    <div className="incidents-page-container">
      <header className="incidents-header">
        <h2>My Incident Logs</h2>
        <p>Track and manage your filed reports</p>
      </header>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Accessing Secure Database...</p>
        </div>
      ) : incidents.length > 0 ? (
        <div className="incidents-grid">
          {incidents.map((incident) => (
            <div key={incident.incidentId} className="incident-summary-card">
              <div className="card-top-row">
                <span className="case-number">#INC-{incident.incidentId}</span>
                <span className={`status-tag ${incident.status.toLowerCase().replace(/\s/g, '-')}`}>
                  {incident.status}
                </span>
              </div>
              <h3>{incident.title}</h3>
              <p className="truncated-desc">{incident.description.substring(0, 80)}...</p>
              <button 
                className="btn-open-report" 
                onClick={() => setActiveReport(incident)}
              >
                View Full Report
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-logs">
          <p>No incidents found in your records.</p>
        </div>
      )}

      {/* --- MODAL OVERLAY --- */}
      {activeReport && (
        <div className="report-modal-overlay" onClick={closeReport}>
          <div className="report-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-sec">
              <div className="header-labels">
                <span className="official-text">OFFICIAL RECORD</span>
                <h2>Incident Details</h2>
              </div>
              <button className="btn-close-x" onClick={closeReport}>&times;</button>
            </div>

            <div className="modal-scroll-body">
              <div className="info-block">
                <label>Case Title</label>
                <div className="data-display highlight">{activeReport.title}</div>
              </div>

              <div className="info-row">
                <div className="info-block">
                  <label>Incident ID</label>
                  <div className="data-display"># {activeReport.incidentId}</div>
                </div>
                <div className="info-block">
                  <label>Status</label>
                  <div className={`status-tag ${activeReport.status.toLowerCase()}`}>
                    {activeReport.status}
                  </div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-block">
                  <label>Assigned Officer</label>
                  <div className={`data-display ${activeReport.officerName === "Not Assigned" ? "text-red" : "text-green"}`}>
                    {activeReport.officerName}
                  </div>
                </div>
                <div className="info-block">
                  <label>Officer ID</label>
                  <div className="data-display">{activeReport.officerId || "Not Assigned"}</div>
                </div>
              </div>

              <div className="info-block">
                <label>Full Narrative / Description</label>
                <div className="description-box-final">
                  {activeReport.description}
                </div>
              </div>
            </div>

            <div className="modal-footer-sec">
              <button 
                className="btn-print" 
                onClick={() => handleDownloadPdf(activeReport.incidentId)}
              >
              Download PDF Report
              </button>
              <button className="btn-close-final" onClick={closeReport}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default GetAllIncident;
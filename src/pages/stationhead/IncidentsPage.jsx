import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./IncidentsPage.css";
import { getRole } from "../../utils/auth";

function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [fullIncident, setFullIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignData, setAssignData] = useState({});
  const [statusData, setStatusData] = useState({});

  // Search State
  const [searchIncidentId, setSearchIncidentId] = useState("");

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

  if (role !== "StationHead") {
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
        officerId: Number(officerId),
      });

      toast.success("Officer assigned successfully ✅");

      setAssignData({
        ...assignData,
        [incidentId]: "",
      });

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
      await API.put(
        `/Incident/UpdateIncidentStatus/${id}?status=${status}`
      );

      toast.success("Case status updated");

      fetchIncidents();
    } catch (err) {
      toast.error(err.response?.data?.Details || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm deletion of this official record?"))
      return;

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
      const response = await API.get(
        `/Incident/DownloadPdf/${id}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        `Incident_Report_${id}.pdf`
      );

      document.body.appendChild(link);

      link.click();

      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("PDF generation failed");
    }
  };

  // Sort active incidents first
  const sortedIncidents = [...incidents].sort((a, b) => {
    const activeStatuses = ["Open", "Pending", "Investigating"];

    const aActive = activeStatuses.includes(a.status);
    const bActive = activeStatuses.includes(b.status);

    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;

    return b.incidentId - a.incidentId;
  });

  // Search by Incident ID
  const filteredIncidents = sortedIncidents.filter((incident) =>
    incident.incidentId
      .toString()
      .includes(searchIncidentId)
  );

  return (
    <div className="admin-incidents-layout">
      <header className="admin-header">
        <div className="title-section">
          <h1>Incident Control Panel</h1>

          <p>
            Monitor system-wide assignments and case lifecycle
          </p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="incident-search-container">
        <input
          type="text"
          placeholder="Search by Incident ID..."
          value={searchIncidentId}
          onChange={(e) =>
            setSearchIncidentId(e.target.value)
          }
          className="incident-search-input"
        />
      </div>

      {loading ? (
        <div className="system-loading">
          Accessing Central Registry...
        </div>
      ) : (
        <div className="admin-incident-grid">
          {filteredIncidents.map((incident) => (
            <div
              key={incident.incidentId}
              className="admin-incident-card"
            >
              <div className="incident-card-inner">
                {/* Left Sidebar */}
                <div className="incident-sidebar">
                  <span className="case-id-tag">
                    #{incident.incidentId}
                  </span>

                  <div
                    className={`status-icon-box ${incident.status?.toLowerCase()}`}
                  >
                    {incident.status?.charAt(0)}
                  </div>

                  <span
                    className={`status-label-pill ${incident.status?.toLowerCase()}`}
                  >
                    {incident.status}
                  </span>

                  <button
                    className="view-btn-side"
                    onClick={() =>
                      handleView(incident.incidentId)
                    }
                  >
                    View Report
                  </button>
                </div>

                {/* Main Content */}
                <div className="incident-main-content">
                  <div className="content-top">
                    <h3>{incident.title}</h3>

                    <button
                      className="purge-btn"
                      onClick={() =>
                        handleDelete(incident.incidentId)
                      }
                    >
                      Delete
                    </button>
                  </div>

                  <div className="personnel-horizontal">
                    <div className="p-item">
                      <span className="p-label">
                        Reporter
                      </span>

                      <span className="p-value">
                        {incident.userName}
                      </span>
                    </div>

                    <div className="p-item">
                      <span className="p-label">
                        Assigned Officer
                      </span>

                      <span className="p-value">
                        {incident.officerName ||
                          "Unassigned"}
                      </span>
                    </div>
                  </div>

                  <div className="control-forms">
                    {/* Assign Officer */}
                    <div className="control-group">
                      <label>Dispatch Personnel</label>

                      <div className="input-with-btn">
                        <input
                          type="number"
                          placeholder="Officer ID"
                          value={
                            assignData[
                              incident.incidentId
                            ] || ""
                          }
                          disabled={
                            incident.status === "Closed" ||
                            incident.status === "Verified"
                          }
                          onChange={(e) =>
                            setAssignData({
                              ...assignData,
                              [incident.incidentId]:
                                e.target.value,
                            })
                          }
                        />

                        <button
                          className="action-btn assign"
                          onClick={() =>
                            handleAssign(
                              incident.incidentId
                            )
                          }
                          disabled={
                            incident.status === "Closed" ||
                            incident.status === "Verified"
                          }
                        >
                          Assign
                        </button>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="control-group">
                      <label>Lifecycle Management</label>

                      <div className="input-with-btn">
                        <select
                          value={
                            statusData[
                              incident.incidentId
                            ] || ""
                          }
                          disabled={
                            incident.status === "Verified"
                          }
                          onChange={(e) =>
                            setStatusData({
                              ...statusData,
                              [incident.incidentId]:
                                e.target.value,
                            })
                          }
                        >
                          <option value="">
                            Status Update
                          </option>

                          <option value="Closed">
                            Closed
                          </option>

                          <option value="Verified">
                            Verified
                          </option>
                        </select>

                        <button
                          className="action-btn update"
                          onClick={() =>
                            handleStatusUpdate(
                              incident.incidentId
                            )
                          }
                          disabled={
                            incident.status === "Verified"
                          }
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredIncidents.length === 0 && (
            <div className="no-results">
              No incidents found
            </div>
          )}
        </div>
      )}

      {/* MODAL */}
      {fullIncident && (
        <div
          className="modal-overlay"
          onClick={() => setFullIncident(null)}
        >
          <div
            className="report-modal-window"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-sec">
              <div>
                <span className="official-stamp">
                  OFFICIAL RECORD
                </span>

                <h2>{fullIncident.title}</h2>
              </div>

              <button
                className="close-x"
                onClick={() => setFullIncident(null)}
              >
                &times;
              </button>
            </div>

            <div className="modal-scroll-content">
              <div className="report-grid-layout">
                <div className="report-box">
                  <h4>Incident Data</h4>

                  <p>
                    <strong>Type:</strong>{" "}
                    {fullIncident.incidentType}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {fullIncident.status}
                  </p>

                  <p className="desc-box">
                    <strong>Description:</strong>{" "}
                    {fullIncident.description}
                  </p>
                </div>

                <div className="report-box">
                  <h4>Personnel Logistics</h4>

                  <p>
                    <strong>Reporter:</strong>{" "}
                    {fullIncident.userName}
                  </p>

                  <p>
                    <strong>Officer:</strong>{" "}
                    {fullIncident.officerName || "N/A"}
                  </p>

                  <p>
                    <strong>Officer Id:</strong>{" "}
                    {fullIncident.officerId ||
                      "Not Assigned"}
                  </p>
                </div>
              </div>

              {fullIncident.imagePath && (
                <div className="report-evidence">
                  <h4>Evidence Repository</h4>

                  <img
                    src={`http://localhost:5109${fullIncident.imagePath}`}
                    alt="Evidence"
                  />
                </div>
              )}
            </div>

            <div className="modal-footer-sec">
              <button
                className="btn-download-pdf"
                onClick={() =>
                  handleDownloadPdf(
                    fullIncident.incidentId
                  )
                }
              >
                Download PDF
              </button>

              <button
                className="btn-close-modal"
                onClick={() => setFullIncident(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default IncidentsPage;
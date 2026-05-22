// OfficerPerformance.jsx

import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate, Navigate } from "react-router-dom";
import "./OfficerPerformance.css";
import { getRole } from "../../utils/auth";

function OfficerPerformance() {
  const navigate = useNavigate();
  const officerId = localStorage.getItem("officerId");
  const role = getRole();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOfficerPerformance();
  }, []);

  // Role Protection
  if (role !== "Officer") {
    alert("Access Denied");
    return <Navigate to="/login" />;
  }

  

  const fetchOfficerPerformance = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/Incident/GetIncidentsByOfficer/${officerId}`
      );

      setIncidents(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Performance Calculations
  const totalCases = incidents.length;

  const closedCases = incidents.filter(
    (i) => i.status === "Closed"
  ).length;

  const activeCases = incidents.filter(
    (i) => i.status === "Active"
  ).length;

  const verifiedCases = incidents.filter(
    (i) => i.status === "Verified"
  ).length;

  const efficiency =
  totalCases > 0
    ? Math.round((verifiedCases / totalCases) * 100)
    : 0;

  return (
    <div className="performance-layout">

      {/* Sidebar */}
      <div className="performance-sidebar">
        <h2 onClick={() => navigate("/")}>🛡️ MEIKAAPPU</h2>

        <ul>
          <li onClick={() => navigate("/officer-dashboard")}>
            Dashboard
          </li>

          

          <li
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="performance-main">

        <div className="performance-header">
          <h1>Officer Performance Analysis</h1>

          <p>
            Real-time investigation analytics for
            Officer ID:
            <strong> #OFF-{officerId}</strong>
          </p>
        </div>

        {loading ? (
          <div className="loading-box">
            Loading Performance Analytics...
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="performance-cards">

              <div className="performance-card">
                <h3>Total Assigned Cases</h3>
                <span>{totalCases}</span>
              </div>

              <div className="performance-card closed-card">
                <h3>Closed Cases</h3>
                <span>{closedCases}</span>
              </div>

              <div className="performance-card active-card">
                <h3>Active Investigations</h3>
                <span>{activeCases}</span>
              </div>

              <div className="performance-card verified-card">
                <h3>Verified Reports</h3>
                <span>{verifiedCases}</span>
              </div>

            </div>

            {/* Efficiency Section */}
            <div className="efficiency-section">

              <div className="efficiency-left">
                <h2>Investigation Efficiency</h2>

                <div className="circle-progress">
                  <div className="circle-inner">
                    {efficiency}%
                  </div>
                </div>

                <p>
                  Investigation efficiency based on
                  successfully verified case reports.
                </p>
              </div>

              <div className="efficiency-right">

                <h2>Performance Summary</h2>

                <div className="summary-item">
                  <span>Case Resolution Rate</span>

                  <div className="progress-bar">
                    <div
                      className="progress-fill blue-fill"
                      style={{ width: `${efficiency}%` }}
                    ></div>
                  </div>
                </div>

                <div className="summary-item">
                  <span>Active Investigation Load</span>

                  <div className="progress-bar">
                    <div
                      className="progress-fill orange-fill"
                      style={{
                        width: `${
                          totalCases > 0
                            ? (activeCases / totalCases) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="summary-item">
                  <span>Verification Success</span>

                  <div className="progress-bar">
                    <div
                      className="progress-fill green-fill"
                      style={{
                        width: `${
                          totalCases > 0
                            ? (verifiedCases / totalCases) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

              </div>
            </div>

            {/* Recent Cases */}
            <div className="recent-cases">

              <h2>Recent Investigation Activity</h2>

              <table>
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Title</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {incidents.slice(0, 6).map((incident) => (
                    <tr key={incident.incidentId}>
                      <td>#INC-{incident.incidentId}</td>

                      <td>{incident.title}</td>

                      <td>
                        <span
                          className={`table-status ${incident.status?.toLowerCase()}`}
                        >
                          {incident.status}
                        </span>
                      </td>

                      <td>{incident.incidentType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OfficerPerformance;
import React, { useEffect, useState, useMemo } from "react";
import { getAllIncidents } from "../../services/incidentservice";
import { getAllOfficers } from "../../services/officerservice";
import { getAllUsers } from "../../services/userservice"; 
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { toast, ToastContainer } from "react-toastify";
import "./CrimeAnalytics.css";

function CrimeAnalytics() {
  const [incidents, setIncidents] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [users, setUsers] = useState([]); // Added Users State
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Added getAllUsers() to the Promise.all
      const [incidentRes, officerRes, userRes] = await Promise.all([
        getAllIncidents(),
        getAllOfficers(),
        getAllUsers(), 
      ]);
      setIncidents(incidentRes.data || []);
      setOfficers(officerRes.data || []);
      setUsers(userRes.data || []);
    } catch (err) {
      toast.error("Failed to sync with central database");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DATA VISUALIZATION ADDITIONS
  // =========================
  
  const chartData = useMemo(() => {
    const categories = ["Lost property", "Petit larceny", "Criminal mischief", "Graffiti"];
    return categories.map(cat => ({
      name: cat,
      count: incidents.filter(i => 
      (i.incidentType || i.IncidentType)?.toLowerCase() === cat.toLowerCase()
    ).length
    }));
  }, [incidents]);

  const monthlyTrendData = useMemo(() => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Get current year to filter out old data if needed
  const currentYear = new Date().getFullYear();

  return months.map((month, index) => {
    const count = incidents.filter(i => {
      // Assuming your backend sends a date string like "2026-05-14T..."
      const date = new Date(i.createdDate || i.CreatedDate); 
      return date.getMonth() === index && date.getFullYear() === currentYear;
    }).length;

    return {
      name: month,
      count: count
    };
  });
}, [incidents]);

  const roleData = useMemo(() => {
    return [
      { name: "Officers", value: officers.length },
      { name: "Citizens", value: users.filter(u => u.role === "User").length },
      { name: "StationHead", value: users.filter(u => u.role === "StationHead").length }
    ];
  }, [users, officers]);

  const PIE_COLORS = ["#03112f", "#6366f1", "#f59e0b"];

  // =========================
  // YOUR ORIGINAL LOGIC (UNCHANGED)
  // =========================

  const stats = useMemo(() => {
    const total = incidents.length;
    const active = incidents.filter(i => ["Active"].includes(i.status)).length;
    const closed = incidents.filter(i => ["Closed"].includes(i.status)).length;
    const verified = incidents.filter(i => ["Verified"].includes(i.status)).length;
    const efficiency = total > 0 ? Math.round((verified / total) * 100) : 0;
    
    return { total, active, closed, verified, efficiency };
  }, [incidents]);

  const recentIncidents = useMemo(() => 
    [...incidents].sort((a, b) => b.incidentId - a.incidentId).slice(0, 6), 
  [incidents]);

  const topOfficers = useMemo(() => 
    [...officers].sort((a, b) => b.verified - a.verified).slice(0, 5), 
  [officers]);

  return (
    <div className="analytics-dashboard-container">
      <header className="dashboard-header-sec">
        <div className="header-info">
          <span className="system-tag">MEIKAAPPU INTELLIGENCE</span>
          <h1>Crime Analytics</h1>
          <p>Real-time oversight of jurisdictional safety and personnel efficiency</p>
        </div>
        <div className="live-badge">
          <span className="pulse-dot"></span>
          SYSTEM LIVE
        </div>
      </header>

      {loading ? (
        <div className="dashboard-loader">Initializing Neural Links...</div>
      ) : (
        <>
          <div className="analytics-stats-grid">
            <div className="glass-stat-card">
              <div className="stat-content">
                <span className="stat-label">Total Incidents</span>
                <h2>{stats.total}</h2>
              </div>
              <div className="stat-icon-wrapper blue">📁</div>
            </div>

            <div className="glass-stat-card">
              <div className="stat-content">
                <span className="stat-label">Active Cases</span>
                <h2>{stats.active}</h2>
              </div>
              <div className="stat-icon-wrapper red">🚨</div>
            </div>

            <div className="glass-stat-card">
              <div className="stat-content">
                <span className="stat-label">Closed Cases</span>
                <h2>{stats.closed}</h2>
              </div>
              <div className="stat-icon-wrapper green">✅</div>
            </div>

            <div className="glass-stat-card">
              <div className="stat-content">
                <span className="stat-label">Efficiency</span>
                <h2>{stats.efficiency}%</h2>
              </div>
              <div className="stat-icon-wrapper gold">🛡️</div>
            </div>
          </div>

          {/* ================= ADDED VISUALS GRID ================= */}
          <div className="visuals-grid">
            <div className="glass-panel chart-box">
              <h3>Incident Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.05)'}} />
                  <Area type="monotone" dataKey="count" stroke="#2563eb" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-panel chart-box">
  <h3>Monthly Incident Trend ({new Date().getFullYear()})</h3>
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={monthlyTrendData}>
      <defs>
        <linearGradient id="colorMonth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
      <XAxis 
        dataKey="name" 
        tick={{fontSize: 10, fontWeight: 600}} 
        axisLine={false} 
        tickLine={false} 
      />
      <YAxis 
        tick={{fontSize: 12}} 
        axisLine={false} 
        tickLine={false} 
      />
      <Tooltip 
        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.05)'}} 
      />
      <Area 
        type="monotone" 
        dataKey="count" 
        stroke="#6366f1" 
        fillOpacity={1} 
        fill="url(#colorMonth)" 
        strokeWidth={3} 
      />
    </AreaChart>
  </ResponsiveContainer>
</div>

            <div className="glass-panel chart-box">
              <h3>Personnel Ratios</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-dual-section">
            <div className="glass-panel activity-panel">
              <div className="panel-header">
                <h3>Jurisdictional Activity</h3>
                <span>Recent Reports</span>
              </div>
              <div className="custom-scroll-list">
                {recentIncidents.map(incident => (
                  <div key={incident.incidentId} className="list-item">
                    <div className="item-main">
                      <span className="item-id">#{incident.incidentId}</span>
                      <div>
                        <h4>{incident.title}</h4>
                        <p>{incident.incidentType}</p>
                      </div>
                    </div>
                    <span className={`status-pill ${incident.status?.toLowerCase().replace(/\s/g, "")}`}>
                      {incident.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel officer-panel">
              <div className="panel-header">
                <h3>Top Responders</h3>
                <span>Current Assignments</span>
              </div>
              <div className="custom-scroll-list">
                {topOfficers.map(officer => (
                  <div key={officer.officerId} className="list-item">
                    <div className="item-main">
                      <div className="item-avatar">
                        {officer.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4>{officer.name}</h4>
                        <p>{officer.rank}</p>
                      </div>
                    </div>
                    <div className="item-badge">{officer.activeCases} Cases</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
}

export default CrimeAnalytics;
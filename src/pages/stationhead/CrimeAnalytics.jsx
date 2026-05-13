// CrimeAnalytics.jsx

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import "./CrimeAnalytics.css";

const crimeTrend = [
  { month: "Jan", crimes: 120 },
  { month: "Feb", crimes: 98 },
  { month: "Mar", crimes: 140 },
  { month: "Apr", crimes: 110 },
  { month: "May", crimes: 170 },
  { month: "Jun", crimes: 130 },
];

const districtData = [
  { district: "North", cases: 80 },
  { district: "South", cases: 120 },
  { district: "East", cases: 65 },
  { district: "West", cases: 95 },
];

const patrolData = [
  { name: "Efficient Patrol", value: 72 },
  { name: "Delayed Response", value: 28 },
];

const COLORS = ["#00c6ff", "#ff5e62"];

function CrimeAnalytics() {
  return (
    <div className="analytics-container">

      <div className="analytics-header">
        <h2>Crime Analytics Dashboard</h2>
        <p>Real-time monitoring of crime rates and patrol efficiency</p>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Crimes</h3>
          <span>1,248</span>
        </div>

        <div className="stat-card">
          <h3>Resolved Cases</h3>
          <span>934</span>
        </div>

        <div className="stat-card">
          <h3>Active Patrols</h3>
          <span>57</span>
        </div>

        <div className="stat-card">
          <h3>Emergency Alerts</h3>
          <span>12</span>
        </div>

      </div>

      <div className="charts-grid">

        {/* Crime Trend */}
        <div className="chart-card">
          <h3>Crime Rate Trends</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={crimeTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e3b55" />
              <XAxis dataKey="month" stroke="#cfd8dc" />
              <YAxis stroke="#cfd8dc" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="crimes"
                stroke="#00c6ff"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* District Crime */}
        <div className="chart-card">
          <h3>District-wise Crime Cases</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={districtData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e3b55" />
              <XAxis dataKey="district" stroke="#cfd8dc" />
              <YAxis stroke="#cfd8dc" />
              <Tooltip />
              <Bar dataKey="cases" fill="#ff5e62" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Patrol Efficiency */}
        <div className="chart-card full-width">
          <h3>Patrol Efficiency Analysis</h3>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={patrolData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {patrolData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default CrimeAnalytics;
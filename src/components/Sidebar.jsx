// components/officer/Sidebar.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

function Sidebar({ active }) {
  const navigate = useNavigate();

  return (
    <div className="performance-sidebar">
      <h2 onClick={() => navigate("/")}>🛡️ MEIKAAPPU</h2>

      <ul>
        <li
          className={active === "dashboard" ? "active" : ""}
          onClick={() => navigate("/officer-dashboard")}
        >
          Dashboard
        </li>

        <li
          className={active === "performance" ? "active" : ""}
          onClick={() => navigate("/officer/performance")}
        >
          Performance
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
  );
}

export default Sidebar;
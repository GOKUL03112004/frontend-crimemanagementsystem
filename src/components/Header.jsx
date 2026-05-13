// components/officer/Header.jsx

import React from "react";

function Header({ title, officerId }) {
  return (
    <div className="performance-header">
      <h1>{title}</h1>

      <p>
        Officer ID:
        <strong> #OFF-{officerId}🛡️</strong>
      </p>
    </div>
  );
}

export default Header;
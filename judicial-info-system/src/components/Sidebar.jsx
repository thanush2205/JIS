import React from "react";
import "../styles/Sidebar.css"; // global sidebar styles

export default function Sidebar({ actions = [], active, onAction, mobileMode=false, open=false, onClose }) {
  return (
    <aside className={`sidebar ${mobileMode? 'mobile': ''} ${open? 'open': ''}`}>
      <div className="sidebar-header-row">
        <h3 className="sidebar-title">Actions</h3>
        {mobileMode && (
          <button aria-label="Close" className="close-btn" onClick={onClose}>×</button>
        )}
      </div>
      <ul>
        {actions.map((action) => (
          <li key={action}>
            <button
              className={`sidebar-btn ${active === action ? "active" : ""}`}
              onClick={() => onAction(action)}
            >
              {action}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

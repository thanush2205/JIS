import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/Layout.css"; // layout base styles
import "../styles/DashboardInputs.css"; // unified enlarged input styles for dashboards

export default function Layout({ roleName, actions, active, setActive, children }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when action changes (mobile UX)
  useEffect(() => { if (isMobile) setShowMobileMenu(false); }, [active, isMobile]);

  return (
    <div className={`layout ${showMobileMenu? 'menu-open': ''}`}>
      <Navbar roleName={roleName} />
      {isMobile && (
        <button
          aria-label="Toggle Actions"
          className="burger-btn"
          onClick={() => setShowMobileMenu(s => !s)}
        >
          <span className="burger-line" />
          <span className="burger-line" />
          <span className="burger-line" />
        </button>
      )}
      <div className="layout-body">
        <Sidebar
          actions={actions}
          onAction={setActive}
          active={active}
          mobileMode={isMobile}
          open={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
        />
        <main className="layout-main">
          {children}
        </main>
      </div>
      {isMobile && showMobileMenu && <div className="backdrop" onClick={() => setShowMobileMenu(false)} />}
    </div>
  );
}

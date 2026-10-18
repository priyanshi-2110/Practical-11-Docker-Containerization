import React from "react";
import { Link, useLocation } from "react-router-dom";

// ─── Navbar ───────────────────────────────────────────────────
// Not lazily loaded (part of the shell) — it must always be
// available immediately, before any route-chunk is fetched.
// ─────────────────────────────────────────────────────────────

function Navbar({ user, onLogout }) {
  const { pathname } = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/projects", label: "Tasks" },
    { to: "/analytics", label: "Analytics" },
    { to: "/contact", label: "Docs" },
    { to: "/about", label: "About" },
  ];

  return (
    <header
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        background: "rgba(11, 15, 25, 0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0.85rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {/* Brand */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 12px rgba(99,102,241,0.4)",
              fontSize: "1.1rem",
              flexShrink: 0,
            }}
          >
            ⚡
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-main)", letterSpacing: "-0.01em" }}>
                TaskFlow
              </span>
              <span
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  background: "rgba(99,102,241,0.2)",
                  color: "#a5b4fc",
                  padding: "2px 7px",
                  borderRadius: "12px",
                  border: "1px solid rgba(99,102,241,0.35)",
                }}
              >
                Pr8
              </span>
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", letterSpacing: "0.01em" }}>
              Lazy Loading &amp; Code Splitting
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: "0.45rem 0.85rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--text-main)" : "var(--text-muted)",
                  background: isActive ? "rgba(99,102,241,0.2)" : "transparent",
                  border: isActive ? "1px solid rgba(99,102,241,0.35)" : "1px solid transparent",
                  textDecoration: "none",
                  transition: "all var(--transition-fast)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: JWT Badge + User + Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          {/* JWT badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.25)",
              color: "#34d399",
              padding: "0.3rem 0.7rem",
              borderRadius: "9999px",
              fontSize: "0.72rem",
              fontWeight: 600,
            }}
            title="All API requests protected with Bearer JWT"
          >
            <span>🔒</span>
            <span>JWT</span>
          </div>

          {/* User email */}
          {user && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.3rem 0.8rem",
                background: "var(--bg-input)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-pill)",
                fontSize: "0.8rem",
                color: "var(--text-main)",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 6px #10b981",
                  display: "inline-block",
                }}
              />
              <span style={{ fontWeight: 600, maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </span>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={onLogout}
            className="btn btn-secondary"
            style={{ padding: "0.4rem 0.85rem", fontSize: "0.82rem" }}
            title="Clear JWT token and log out"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

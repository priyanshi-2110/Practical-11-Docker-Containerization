import React from "react";
import { Link } from "react-router-dom";

// ─── Home Page ──────────────────────────────────────────────
// This is a LAZILY LOADED chunk — it is only downloaded when
// the user navigates to "/" after the initial shell loads.
// ─────────────────────────────────────────────────────────────

function Home({ user }) {
  const features = [
    {
      icon: "🔐",
      title: "JWT Authentication",
      desc: "Every task request is authenticated with a signed JSON Web Token (Bearer). Passwords are hashed with bcrypt before storage.",
      color: "#6366f1",
    },
    {
      icon: "✅",
      title: "Server-Side Validation",
      desc: "The validateTask middleware rejects requests with missing or empty titles before they reach MongoDB — defence beyond the UI.",
      color: "#10b981",
    },
    {
      icon: "⚡",
      title: "Lazy-Loaded Routes",
      desc: "Practical 8: Every page (Home, Projects, Analytics, Contact) is a separate JS chunk, loaded only on demand — not upfront.",
      color: "#f59e0b",
    },
    {
      icon: "🗄️",
      title: "MongoDB Atlas / Local",
      desc: "Task data persists in a real MongoDB database via Mongoose ODM, connected through a secure MONGO_URI environment variable.",
      color: "#06b6d4",
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      desc: "View real-time task statistics — completion rates, priority breakdown, and trend bars — all rendered as a lazily-loaded page.",
      color: "#a78bfa",
    },
    {
      icon: "🔁",
      title: "Real-Time CRUD",
      desc: "Create, read, update (toggle), and delete tasks with optimistic state updates and instant toast feedback — no page refresh needed.",
      color: "#f43f5e",
    },
  ];

  const architecture = [
    { label: "Browser", icon: "🌐" },
    { label: "React Router", icon: "🔀" },
    { label: "Suspense / Lazy", icon: "⏳" },
    { label: "Auth Middleware", icon: "🛡️" },
    { label: "Express API", icon: "🖥️" },
    { label: "MongoDB", icon: "🍃" },
  ];

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

      {/* ── Hero Section ─────────────────────────────────── */}
      <section style={{ textAlign: "center", padding: "3.5rem 1rem 3rem", position: "relative" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(99, 102, 241, 0.15)",
            border: "1px solid rgba(99, 102, 241, 0.35)",
            borderRadius: "9999px",
            padding: "0.4rem 1rem",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "#a5b4fc",
            marginBottom: "1.75rem",
            letterSpacing: "0.04em",
          }}
        >
          <span>⚡</span>
          <span>Practical 8 · Performance Optimization &amp; Lazy Loading</span>
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #ffffff 30%, #94a3b8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "1.25rem",
          }}
        >
          Task Management
          <br />
          <span style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Full-Stack App
          </span>
        </h1>

        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "580px", margin: "0 auto 2.25rem", lineHeight: 1.65 }}>
          A React + Express + MongoDB application implementing JWT-based authentication, server-side validation middleware, and route-based code splitting with <code style={{ background: "rgba(255,255,255,0.1)", padding: "2px 7px", borderRadius: "4px", fontSize: "0.9em" }}>React.lazy()</code> + <code style={{ background: "rgba(255,255,255,0.1)", padding: "2px 7px", borderRadius: "4px", fontSize: "0.9em" }}>Suspense</code>.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          {user ? (
            <Link to="/projects" className="btn btn-primary" style={{ padding: "0.85rem 2rem", fontSize: "1rem" }}>
              Open Task Dashboard →
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: "0.85rem 2rem", fontSize: "1rem" }}>
              Get Started — Sign In →
            </Link>
          )}
          <Link to="/analytics" className="btn btn-secondary" style={{ padding: "0.85rem 2rem", fontSize: "1rem" }}>
            View Analytics
          </Link>
          <Link to="/about" className="btn btn-secondary" style={{ padding: "0.85rem 2rem", fontSize: "1rem" }}>
            About Developer 👤
          </Link>
        </div>
      </section>

      {/* ── Architecture Pipeline ──────────────────────────── */}
      <section style={{ margin: "1rem 0 3.5rem" }}>
        <div
          className="glass-card"
          style={{
            padding: "1.5rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0",
            flexWrap: "wrap",
            overflow: "hidden",
          }}
        >
          <p style={{ color: "var(--text-dim)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginRight: "1.5rem" }}>
            Request Pipeline
          </p>
          {architecture.map((item, i) => (
            <React.Fragment key={item.label}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.5rem 0.75rem",
                }}
              >
                <span style={{ fontSize: "1.4rem" }}>{item.icon}</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {item.label}
                </span>
              </div>
              {i < architecture.length - 1 && (
                <span style={{ color: "var(--text-dim)", fontSize: "1.2rem", padding: "0 0.25rem" }}>→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── Feature Cards ──────────────────────────────────── */}
      <section>
        <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            What's Implemented
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
            Covering Practical 6 through Practical 8 objectives.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="glass-card"
              style={{
                padding: "1.5rem",
                borderLeft: `3px solid ${f.color}`,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 12px 35px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{f.icon}</div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.4rem", color: f.color }}>
                {f.title}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.55 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Code Splitting Explainer ────────────────────────── */}
      <section style={{ marginTop: "3.5rem" }}>
        <div className="glass-card" style={{ padding: "2rem 2rem" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1.25rem" }}>
            🔀 How Route-Based Code Splitting Works Here
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <p style={{ fontWeight: 700, color: "#f43f5e", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
                ❌ Before (Single Bundle)
              </p>
              <pre
                style={{
                  background: "rgba(244,63,94,0.07)",
                  border: "1px solid rgba(244,63,94,0.2)",
                  borderRadius: "8px",
                  padding: "1rem",
                  fontSize: "0.8rem",
                  color: "#fda4af",
                  fontFamily: "var(--font-mono)",
                  lineHeight: 1.6,
                  overflowX: "auto",
                }}
              >
{`// Static import — included in
// main.bundle.js regardless of route
import Projects from './pages/Projects';
import AuthView from './components/AuthView';
import Analytics from './pages/Analytics';
import Contact from './pages/Contact';
// ➜ All code loaded at startup
// ➜ main.bundle.js = 225 kB`}
              </pre>
            </div>
            <div>
              <p style={{ fontWeight: 700, color: "#10b981", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
                ✅ After (Lazy Chunks)
              </p>
              <pre
                style={{
                  background: "rgba(16,185,129,0.07)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: "8px",
                  padding: "1rem",
                  fontSize: "0.8rem",
                  color: "#6ee7b7",
                  fontFamily: "var(--font-mono)",
                  lineHeight: 1.6,
                  overflowX: "auto",
                }}
              >
{`// Dynamic import — separate chunks
const Projects  = lazy(() => import('./pages/Projects'));
const AuthView  = lazy(() => import('./components/AuthView'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Contact   = lazy(() => import('./pages/Contact'));
// Wrapped in <Suspense fallback={<PageLoader />}>
// ➜ main bundle smaller
// ➜ chunks loaded only when visited`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── Developer Profile Spotlight ─────────────────────── */}
      <section style={{ marginTop: "3rem" }}>
        <div
          className="glass-card"
          style={{
            padding: "2rem 2.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.75rem",
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)",
            border: "1px solid rgba(99, 102, 241, 0.25)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap", maxWidth: "750px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "#ffffff",
                boxShadow: "0 8px 20px -4px rgba(99, 102, 241, 0.5)",
                flexShrink: 0,
              }}
            >
              PP
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.25rem" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>Priyanshi Padshala</h3>
                <span style={{ fontSize: "0.72rem", background: "rgba(99,102,241,0.2)", color: "#a5b4fc", padding: "2px 8px", borderRadius: "9999px", fontWeight: 700 }}>
                  B.Tech IT · CHARUSAT
                </span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.55 }}>
                Hands-on experience in software development, data analysis, machine learning, and AI-powered applications. Completed Practicals 6 through 10 in this repository.
              </p>
            </div>
          </div>

          <Link
            to="/about"
            className="btn btn-primary"
            style={{ padding: "0.75rem 1.5rem", fontSize: "0.9rem" }}
          >
            View Full Profile →
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;

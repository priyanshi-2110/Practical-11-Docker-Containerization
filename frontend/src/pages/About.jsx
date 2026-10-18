import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// ─── About Page (Developer Profile) ──────────────────────────
// Lazily loaded route chunk for "/about".
// Showcases developer bio, technical domains, skills matrix,
// and full-stack lab practical achievements (Pr 6 - 10).
// ─────────────────────────────────────────────────────────────

function About({ user }) {
  const [activeSkillCategory, setActiveSkillCategory] = useState("all");
  const [copied, setCopied] = useState(false);

  const developerInfo = {
    name: "Priyanshi Padshala",
    role: "B.Tech Information Technology Student",
    university: "CHARUSAT",
    studentId: "24IT056",
    email: "24it056@charusat.edu.in",
    github: "https://github.com/priyanshi-2110",
    bio: "B.Tech Information Technology student with hands-on experience in software development, data analysis, machine learning, and AI-powered applications. Interested in building practical software solutions by combining programming, data-driven approaches, and emerging AI technologies. A motivated problem-solver seeking opportunities to apply technical skills and grow as a well-rounded software engineer.",
  };

  const domains = [
    {
      icon: "💻",
      title: "Software & Web Engineering",
      color: "#6366f1",
      badge: "Full-Stack",
      desc: "Architecting end-to-end web applications with modern frontend frameworks, RESTful Express APIs, and scalable MongoDB schemas.",
      skills: ["React 19", "Node.js", "Express.js", "MongoDB", "REST APIs", "Vite", "JavaScript (ES6+)"],
    },
    {
      icon: "🤖",
      title: "Machine Learning & AI",
      color: "#06b6d4",
      badge: "Intelligent Systems",
      desc: "Developing AI-powered applications and predictive solutions by blending intelligent model integrations with practical software workflows.",
      skills: ["Machine Learning", "AI Integrations", "Python", "Data Modeling", "Prompt Systems"],
    },
    {
      icon: "📊",
      title: "Data Analysis & Science",
      color: "#10b981",
      badge: "Data-Driven",
      desc: "Extracting actionable insights from structured data using computational libraries, data wrangling pipelines, and analytical visualizers.",
      skills: ["Pandas", "NumPy", "Data Cleaning", "Data Visualization", "Analytics Pipelines"],
    },
    {
      icon: "⚡",
      title: "Performance & Systems",
      color: "#f59e0b",
      badge: "Optimization",
      desc: "Building high-throughput backends with event-driven architectures, caching layers, and route-level code splitting.",
      skills: ["Event-Driven (Node)", "In-Memory Caching", "Lazy Loading", "JWT Security", "Async Processing"],
    },
  ];

  const skillCategories = [
    { id: "all", label: "All Skills" },
    { id: "languages", label: "Languages" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend & DB" },
    { id: "ai_data", label: "AI & Data" },
  ];

  const allSkills = [
    { name: "JavaScript", category: "languages", level: "Advanced", icon: "⚡" },
    { name: "Python", category: "languages", level: "Advanced", icon: "🐍" },
    { name: "HTML5 / CSS3", category: "languages", level: "Expert", icon: "🎨" },
    { name: "React 19", category: "frontend", level: "Advanced", icon: "⚛️" },
    { name: "React Router", category: "frontend", level: "Advanced", icon: "🔀" },
    { name: "Vite Bundler", category: "frontend", level: "Advanced", icon: "⚡" },
    { name: "Node.js", category: "backend", level: "Advanced", icon: "🟢" },
    { name: "Express.js", category: "backend", level: "Advanced", icon: "🚂" },
    { name: "MongoDB & Mongoose", category: "backend", level: "Advanced", icon: "🍃" },
    { name: "JWT & Bcrypt", category: "backend", level: "Proficient", icon: "🔐" },
    { name: "Node-Cache", category: "backend", level: "Proficient", icon: "💾" },
    { name: "EventEmitter", category: "backend", level: "Proficient", icon: "📡" },
    { name: "Machine Learning", category: "ai_data", level: "Intermediate", icon: "🧠" },
    { name: "AI Applications", category: "ai_data", level: "Intermediate", icon: "🤖" },
    { name: "Pandas & NumPy", category: "ai_data", level: "Proficient", icon: "📈" },
    { name: "Data Analysis", category: "ai_data", level: "Advanced", icon: "📊" },
  ];

  const filteredSkills =
    activeSkillCategory === "all"
      ? allSkills
      : allSkills.filter((s) => s.category === activeSkillCategory);

  const practicalTimeline = [
    {
      pr: "PR 11",
      title: "Containerization with Docker & Docker Compose",
      tag: "Latest Milestone",
      tagColor: "#06b6d4",
      desc: "Containerized frontend (React multi-stage build), backend (Node/Express), and MongoDB services orchestrated seamlessly with Docker Compose, named volumes, and bridge networking.",
    },
    {
      pr: "PR 10",
      title: "Event-Driven Architecture & Async Task Processing",
      tag: "Async Processing",
      tagColor: "#10b981",
      desc: "Implemented Node.js EventEmitter pattern with decoupled background listeners, simulating asynchronous non-blocking notifications and resilient error handling.",
    },
    {
      pr: "PR 09",
      title: "In-Memory Caching & Latency Optimization",
      tag: "Performance",
      tagColor: "#06b6d4",
      desc: "Integrated node-cache caching layer with automatic invalidation strategies, dropping API read latency from ~18ms to under 5ms.",
    },
    {
      pr: "PR 08",
      title: "Route-Based Code Splitting & Lazy Loading",
      tag: "Frontend Architecture",
      tagColor: "#f59e0b",
      desc: "Adopted React.lazy() and Suspense fallback loading screens, slashing initial bundle size and establishing modular chunk loading.",
    },
    {
      pr: "PR 07",
      title: "Authentication & Cryptographic Security",
      tag: "Security",
      tagColor: "#6366f1",
      desc: "Built full JWT token lifecycle management with Bearer verification, bcrypt password hashing, and route protection middleware.",
    },
    {
      pr: "PR 06",
      title: "Full-Stack Integration & RESTful Persistence",
      tag: "Full-Stack",
      tagColor: "#ec4899",
      desc: "Integrated React UI client with Express API endpoints and MongoDB persistence for real-time task management.",
    },
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(developerInfo.email);
    setCopied(true);
    toast.success("Email copied to clipboard!", { id: "copy-email" });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
      {/* ── Hero Profile Header ─────────────────────────── */}
      <section
        className="glass-card"
        style={{
          padding: "2.5rem 2rem",
          marginBottom: "2.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "240px",
            height: "240px",
            background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          {/* Avatar & Title info */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "24px",
                background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                fontWeight: 900,
                color: "#ffffff",
                boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.5), inset 0 0 10px rgba(255,255,255,0.2)",
                border: "2px solid rgba(255,255,255,0.2)",
                flexShrink: 0,
              }}
            >
              PP
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
                  {developerInfo.name}
                </h1>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    background: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    color: "#34d399",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34d399", display: "inline-block" }}></span>
                  Open to Opportunities
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", color: "var(--text-muted)", fontSize: "0.95rem" }}>
                <span style={{ color: "#a5b4fc", fontWeight: 600 }}>{developerInfo.role}</span>
                <span>•</span>
                <span>{developerInfo.university}</span>
                <span>•</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-dim)" }}>
                  ID: {developerInfo.studentId}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={handleCopyEmail}
              className="btn btn-secondary"
              style={{ fontSize: "0.875rem", padding: "0.6rem 1.1rem" }}
            >
              <span>{copied ? "✅ Copied" : "✉️ Copy Email"}</span>
            </button>
            <a
              href={developerInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ fontSize: "0.875rem", padding: "0.6rem 1.25rem" }}
            >
              <span>🐙 GitHub Profile</span>
            </a>
          </div>
        </div>

        {/* ── Professional Bio Highlight ─────────────────── */}
        <div
          style={{
            marginTop: "2rem",
            padding: "1.25rem 1.5rem",
            background: "rgba(99, 102, 241, 0.08)",
            borderRadius: "12px",
            borderLeft: "4px solid #6366f1",
            borderTop: "1px solid rgba(99, 102, 241, 0.2)",
            borderRight: "1px solid rgba(99, 102, 241, 0.15)",
            borderBottom: "1px solid rgba(99, 102, 241, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "1rem" }}>💡</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#a5b4fc" }}>
              Professional Summary
            </span>
          </div>
          <p
            style={{
              color: "var(--text-main)",
              fontSize: "1.02rem",
              lineHeight: 1.7,
              fontWeight: 500,
            }}
          >
            {developerInfo.bio}
          </p>
        </div>
      </section>

      {/* ── Core Competency Domains ───────────────────────── */}
      <section style={{ marginBottom: "3rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span style={{ fontSize: "1.2rem" }}>🎯</span>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 800 }}>Core Technical Domains</h2>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
            Combining software engineering principles with data-driven workflows and emerging AI technologies.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {domains.map((domain) => (
            <div
              key={domain.title}
              className="glass-card"
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderTop: `3px solid ${domain.color}`,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 14px 30px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.12)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "1.8rem" }}>{domain.icon}</span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid var(--border-subtle)",
                      padding: "0.2rem 0.55rem",
                      borderRadius: "6px",
                      color: domain.color,
                    }}
                  >
                    {domain.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.65rem", color: "var(--text-main)" }}>
                  {domain.title}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.865rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                  {domain.desc}
                </p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {domain.skills.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      background: "var(--bg-input)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-muted)",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "6px",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Skills Matrix ─────────────────────────────────── */}
      <section className="glass-card" style={{ padding: "2rem", marginBottom: "3rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.25rem" }}>
              🛠️ Technical Skills &amp; Stack
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
              Categorized technologies used across academic coursework and practical implementations.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {skillCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveSkillCategory(c.id)}
                style={{
                  padding: "0.4rem 0.85rem",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  borderRadius: "8px",
                  cursor: "pointer",
                  border:
                    activeSkillCategory === c.id
                      ? "1px solid #6366f1"
                      : "1px solid var(--border-subtle)",
                  background:
                    activeSkillCategory === c.id
                      ? "rgba(99, 102, 241, 0.25)"
                      : "rgba(255, 255, 255, 0.04)",
                  color:
                    activeSkillCategory === c.id
                      ? "#ffffff"
                      : "var(--text-muted)",
                  transition: "all 0.15s ease",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "0.85rem",
          }}
        >
          {filteredSkills.map((s) => (
            <div
              key={s.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 1rem",
                background: "var(--bg-input)",
                borderRadius: "10px",
                border: "1px solid var(--border-subtle)",
                transition: "border-color 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>{s.icon}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>
                  {s.name}
                </span>
              </div>
              <span
                style={{
                  fontSize: "0.68rem",
                  color: "var(--text-dim)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {s.level}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Practical & Lab Milestones ─────────────────────── */}
      <section style={{ marginBottom: "3rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span style={{ fontSize: "1.2rem" }}>🏆</span>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 800 }}>Coursework &amp; Lab Milestones</h2>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
            Full-stack engineering journey completed inside this workspace repository (Practical 6 to Practical 10).
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {practicalTimeline.map((item) => (
            <div
              key={item.pr}
              className="glass-card"
              style={{
                padding: "1.25rem 1.5rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "1.25rem",
                borderLeft: `3px solid ${item.tagColor}`,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  color: item.tagColor,
                  background: "rgba(255,255,255,0.05)",
                  padding: "0.35rem 0.65rem",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                {item.pr}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
                  <h3 style={{ fontSize: "0.98rem", fontWeight: 700, color: "var(--text-main)" }}>
                    {item.title}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: item.tagColor,
                      background: "rgba(255,255,255,0.04)",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "9999px",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.55 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick Links / Navigation Footer ───────────────── */}
      <section
        className="glass-card"
        style={{
          padding: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)",
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.3rem" }}>
            Explore the Application
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            Test live authenticated task operations or inspect the performance analytics dashboard.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
          <Link to="/projects" className="btn btn-primary" style={{ fontSize: "0.88rem" }}>
            Open Tasks Dashboard →
          </Link>
          <Link to="/analytics" className="btn btn-secondary" style={{ fontSize: "0.88rem" }}>
            View Analytics
          </Link>
          <Link to="/contact" className="btn btn-secondary" style={{ fontSize: "0.88rem" }}>
            Lab Docs
          </Link>
        </div>
      </section>
    </main>
  );
}

export default About;

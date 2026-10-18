import React, { useState } from "react";

// ─── Contact Page (Lab Documentation) ─────────────────────────
// Lazily-loaded chunk: downloaded when user navigates to /contact
// Includes interactive documentation for Practical 11 (Docker & Docker Compose),
// Practical 10 (Event-Driven Architecture), and Practical 8 (Lazy Loading).
// ─────────────────────────────────────────────────────────────

function Contact() {
  const [activeTab, setActiveTab] = useState("pr11"); // "pr11" | "pr10" | "pr8"

  // ── Practical 11 Data ───────────────────────────────────────
  const pr11Info = [
    { label: "Practical", value: "Practical 11" },
    { label: "CO / PO", value: "CO5 / PO3, PO5" },
    { label: "Technology", value: "Docker & Docker Compose" },
    { label: "Services", value: "3 (Frontend, Backend, MongoDB)" },
    { label: "Bridge Network", value: "app-network" },
    { label: "Data Persistence", value: "mongo-data (Named Volume)" },
    { label: "Build Strategy", value: "Multi-Stage Dockerfile" },
    { label: "One-Click Command", value: "docker-compose up --build" },
  ];

  const pr11Concepts = [
    {
      q: "Why does the backend container need to reference the MongoDB container by its service name (mongodb) rather than localhost?",
      a: "In Docker, each container runs in its own network namespace with its own loopback interface (localhost / 127.0.0.1). If backend tries to connect to localhost:27017, it queries itself instead of MongoDB. When containers join a user-defined bridge network (app-network), Docker's embedded DNS server automatically resolves service names defined in docker-compose.yml (e.g. mongodb) to their dynamic container IP addresses.",
      icon: "🌐",
    },
    {
      q: "What is the difference between EXPOSE in a Dockerfile and the ports mapping in docker-compose.yml?",
      a: "EXPOSE is primarily documentation and metadata — it tells Docker and users which port the container listens on, but does NOT publish the port to the host system. The ports directive in docker-compose.yml (e.g. 5000:5000) actively binds and forwards host machine ports to container ports, allowing outside traffic (like a web browser or Postman) to access the service.",
      icon: "🔌",
    },
    {
      q: "Why is it considered bad practice to copy node_modules into a Docker image instead of running npm install inside the container?",
      a: "1) Native binary compatibility: packages like bcrypt compile OS-specific C++ binaries for the host (e.g. Windows win32); copying them into a Linux Alpine container causes 'invalid ELF header' crashes. 2) Build context bloat: copying massive node_modules folders slows down image building. 3) Consistency: running npm install inside the container ensures clean, deterministic dependencies built for the exact Linux environment.",
      icon: "📦",
    },
  ];

  const pr11Supplementary = [
    {
      title: "Supplementary 1: .dockerignore Optimization",
      desc: "Created .dockerignore in both backend and frontend to exclude host node_modules, build directories, logs, and sensitive .env files from the build context.",
      badge: "Completed",
    },
    {
      title: "Supplementary 2: Multi-Stage Build for React Frontend",
      desc: "Implemented a 2-stage Dockerfile: Stage 1 builds static assets using Node.js & Vite; Stage 2 copies only the production dist output to a lean runtime, minimizing image size.",
      badge: "Completed",
    },
    {
      title: "Supplementary 3: Named Volume for MongoDB Durability",
      desc: "Configured mongo-data:/data/db in docker-compose.yml so that database collections and documents persist across container stops, restarts, and removals.",
      badge: "Verified",
    },
  ];

  // ── Practical 10 Data ───────────────────────────────────────
  const pr10Info = [
    { label: "Practical", value: "Practical 10" },
    { label: "CO / PO", value: "CO4 / PO3, PO5" },
    { label: "Core Pattern", value: "Node.js EventEmitter" },
    { label: "Dependencies", value: "Native events (Zero external)" },
    { label: "Events", value: "task-created, task-deleted, error" },
    { label: "Client Response Time", value: "~18 ms (Instant)" },
    { label: "Simulated Delay", value: "2000 ms (Non-blocking)" },
    { label: "Decoupling", value: "Producer / Consumer Pattern" },
  ];

  const pr10Concepts = [
    {
      q: "Why does emitting an event not block the API response, even though both run on the same Node.js process?",
      a: "Node.js operates on an event-driven, single-threaded Event Loop. When res.status(201).json(newTask) is invoked, the HTTP response headers and body are written to the TCP socket buffer immediately. The background event listener defers slow operations (via setTimeout or asynchronous I/O), offloading them to the Event Loop's timers queue. The main call stack completes the response cycle immediately in ~18ms, while the slow background handler runs later without delaying the client.",
      icon: "⚡",
    },
    {
      q: "What would happen to API response time if the notification logic were placed directly inside the POST route instead of in an event handler?",
      a: "If the notification logic (such as an email send, webhook call, or our simulated 2-second delay) was called synchronously inside the POST route before sending the response, the client would remain blocked in a pending HTTP state for over 2,000ms (~2 seconds). This degrades user experience, increases server connection concurrency, and makes the UI feel sluggish.",
      icon: "⏱️",
    },
    {
      q: "Why is EventEmitter a reasonable choice for this scale of application, but not for a production system handling millions of events per day?",
      a: "EventEmitter is built into Node.js, requires no external infrastructure (like RabbitMQ or Redis), runs entirely in-memory, and provides low-overhead decoupling for single-instance monoliths. However, at enterprise scale (millions of daily events): (1) In-memory events are lost if the process crashes (no persistence); (2) Events cannot cross process boundaries in a multi-instance/clustered environment; (3) It lacks rate-limiting, dead-letter queues, exponential backoff retries, and distributed consumer groups.",
      icon: "🌐",
    },
  ];

  // ── Practical 8 Data ────────────────────────────────────────
  const pr8Info = [
    { label: "Practical", value: "Practical 8" },
    { label: "CO / PO", value: "CO1 / PO3, PO5" },
    { label: "Technique", value: "React.lazy() + Suspense" },
    { label: "Baseline Bundle", value: "225.27 kB" },
    { label: "After Splitting", value: "Route Chunks" },
    { label: "Chunk Strategy", value: "Route-based" },
    { label: "Fallback UI", value: "PageLoader skeleton" },
    { label: "Min Delay", value: "300ms (Analytics)" },
  ];

  const pr8Concepts = [
    {
      q: "What is the difference between the initial bundle and a lazy-loaded chunk?",
      a: "The initial bundle (main.js) is downloaded and parsed immediately when the app first loads — it contains only the shell code needed to bootstrap React and routing. A lazy-loaded chunk is a separate JS file downloaded only when the user navigates to that route for the first time, saving bandwidth and CPU parse time.",
      icon: "📦",
    },
    {
      q: "Why does lazy loading improve perceived performance even though total code eventually stays the same?",
      a: "Perceived performance is dominated by Time to Interactive (TTI). By splitting code into on-demand chunks, the initial bundle is smaller and parses faster. Users rarely visit every route in a session, so many chunks may never be downloaded at all.",
      icon: "⚡",
    },
    {
      q: "When would lazy loading NOT be worth the added complexity?",
      a: "In tiny apps (< 50 kB total JS), the overhead of extra HTTP requests may outweigh bundle savings. Also, if users visit every screen sequentially (like a wizard) or on high-latency networks where chunk delays cause loading flashes.",
      icon: "🤔",
    },
  ];

  return (
    <main style={{ maxWidth: "1050px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
      {/* ── Page Header ──────────────────────────────────── */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "1.8rem" }}>📝</span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Lab Documentation &amp; Analysis
          </h1>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Comprehensive architectural explanations, container configs, and analysis questions for coursework practicals.
        </p>
      </div>

      {/* ── Tab Switcher ─────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "2rem",
          background: "var(--bg-input)",
          padding: "0.4rem",
          borderRadius: "12px",
          width: "fit-content",
          border: "1px solid var(--border-subtle)",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setActiveTab("pr11")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            fontSize: "0.88rem",
            fontWeight: 700,
            cursor: "pointer",
            border: "none",
            transition: "all 0.2s ease",
            background: activeTab === "pr11" ? "linear-gradient(135deg, #06b6d4, #0284c7)" : "transparent",
            color: activeTab === "pr11" ? "#ffffff" : "var(--text-muted)",
            boxShadow: activeTab === "pr11" ? "0 4px 12px rgba(6,182,212,0.3)" : "none",
          }}
        >
          🐳 Practical 11: Docker &amp; Compose
        </button>
        <button
          onClick={() => setActiveTab("pr10")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            fontSize: "0.88rem",
            fontWeight: 700,
            cursor: "pointer",
            border: "none",
            transition: "all 0.2s ease",
            background: activeTab === "pr10" ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "transparent",
            color: activeTab === "pr10" ? "#ffffff" : "var(--text-muted)",
            boxShadow: activeTab === "pr10" ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
          }}
        >
          🚀 Practical 10: Event-Driven Async
        </button>
        <button
          onClick={() => setActiveTab("pr8")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            fontSize: "0.88rem",
            fontWeight: 700,
            cursor: "pointer",
            border: "none",
            transition: "all 0.2s ease",
            background: activeTab === "pr8" ? "linear-gradient(135deg, #10b981, #059669)" : "transparent",
            color: activeTab === "pr8" ? "#ffffff" : "var(--text-muted)",
            boxShadow: activeTab === "pr8" ? "0 4px 12px rgba(16,185,129,0.3)" : "none",
          }}
        >
          ⚡ Practical 8: Lazy Loading
        </button>
      </div>

      {activeTab === "pr11" ? (
        /* ══════════════════════════════════════════════════════
           PRACTICAL 11 VIEW (DOCKER & COMPOSE)
           ══════════════════════════════════════════════════════ */
        <div className="animate-fade-in">
          {/* Quick reference metrics */}
          <section className="glass-card" style={{ padding: "1.5rem 2rem", marginBottom: "2.25rem" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1.25rem" }}>
              ⚙️ Practical 11 Specification Reference
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
              {pr11Info.map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: "0.75rem 1rem",
                    background: "var(--bg-input)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                    {item.label}
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--text-main)", fontFamily: "var(--font-mono)", fontSize: "0.88rem" }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Architecture & Flow */}
          <section className="glass-card" style={{ padding: "1.75rem 2rem", marginBottom: "2.25rem" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1rem" }}>
              🐳 Multi-Container Orchestration Architecture
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              All 3 services run on an isolated bridge network with service-name DNS discovery and persistent database volume mapping.
            </p>

            <pre
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "10px",
                padding: "1.25rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.82rem",
                lineHeight: 1.65,
                color: "#67e8f9",
                overflowX: "auto",
              }}
            >
{`docker-compose.yml
├── frontend (React 19 + Vite preview, port 5173:5173)
├── backend  (Node/Express API, port 5000:5000)
└── mongodb  (Official mongo:latest image, port 27017:27017)
Network: app-network (bridge)
Volume:  mongo-data (persistent named storage)

Orchestration Command:
$ docker-compose up --build`}
            </pre>
          </section>

          {/* Key Analysis Questions */}
          <section style={{ marginBottom: "2.25rem" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1.25rem" }}>
              🎯 Key Analysis Questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {pr11Concepts.map((c, i) => (
                <div
                  key={i}
                  className="glass-card"
                  style={{ padding: "1.5rem 1.75rem", borderLeft: "3px solid #06b6d4" }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <span style={{ fontSize: "1.5rem", flexShrink: 0, marginTop: "2px" }}>{c.icon}</span>
                    <div>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.65rem", color: "var(--text-main)" }}>
                        Q{i + 1}: {c.q}
                      </h3>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.65 }}>
                        {c.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Supplementary Problems */}
          <section className="glass-card" style={{ padding: "1.75rem 2rem" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1.25rem" }}>
              🧩 Supplementary Problems Addressed
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {pr11Supplementary.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "1rem 1.25rem",
                    background: "var(--bg-input)",
                    borderRadius: "10px",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ maxWidth: "720px" }}>
                    <h3 style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.35rem" }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: 1.55 }}>
                      {item.desc}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      background: "rgba(6, 182, 212, 0.15)",
                      color: "#38bdf8",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "9999px",
                      border: "1px solid rgba(6, 182, 212, 0.3)",
                      flexShrink: 0,
                    }}
                  >
                    ✓ {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : activeTab === "pr10" ? (
        /* ══════════════════════════════════════════════════════
           PRACTICAL 10 VIEW
           ══════════════════════════════════════════════════════ */
        <div className="animate-fade-in">
          <section className="glass-card" style={{ padding: "1.5rem 2rem", marginBottom: "2.25rem" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1.25rem" }}>
              ⚙️ Practical 10 Specification Reference
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
              {pr10Info.map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: "0.75rem 1rem",
                    background: "var(--bg-input)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                    {item.label}
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--text-main)", fontFamily: "var(--font-mono)", fontSize: "0.88rem" }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: "2.25rem" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1.25rem" }}>
              🎯 Key Analysis Questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {pr10Concepts.map((c, i) => (
                <div
                  key={i}
                  className="glass-card"
                  style={{ padding: "1.5rem 1.75rem", borderLeft: "3px solid #6366f1" }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <span style={{ fontSize: "1.5rem", flexShrink: 0, marginTop: "2px" }}>{c.icon}</span>
                    <div>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.65rem", color: "var(--text-main)" }}>
                        Q{i + 1}: {c.q}
                      </h3>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.65 }}>
                        {c.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════
           PRACTICAL 8 VIEW
           ══════════════════════════════════════════════════════ */
        <div className="animate-fade-in">
          <section className="glass-card" style={{ padding: "1.5rem 2rem", marginBottom: "2.25rem" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1.25rem" }}>
              ⚙️ Practical 8 Implementation Reference
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
              {pr8Info.map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: "0.75rem 1rem",
                    background: "var(--bg-input)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                    {item.label}
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--text-main)", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1.25rem" }}>
              🎯 Key Analysis Questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {pr8Concepts.map((c, i) => (
                <div
                  key={i}
                  className="glass-card"
                  style={{ padding: "1.5rem 1.75rem", borderLeft: "3px solid #10b981" }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <span style={{ fontSize: "1.5rem", flexShrink: 0, marginTop: "2px" }}>{c.icon}</span>
                    <div>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.65rem", color: "var(--text-main)" }}>
                        Q{i + 1}: {c.q}
                      </h3>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.65 }}>
                        {c.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Contact;

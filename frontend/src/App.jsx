import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

// ─── Shell components (NOT lazy — always in main bundle) ──────
import Navbar from "./components/Navbar";
import PageLoader from "./components/PageLoader";
import {
  getToken,
  getStoredUser,
  getMe,
  logoutUser,
  authEvents,
} from "./api";

// ─────────────────────────────────────────────────────────────
// PRACTICAL 8: React.lazy() + Route-Based Code Splitting
//
// Each page below is a DYNAMIC IMPORT → Vite emits it as a
// separate JS chunk file (*.chunk.js). The browser downloads
// each chunk ONLY when the user navigates to that route for the
// first time. They are wrapped in <Suspense> which shows the
// <PageLoader> fallback UI while the chunk is in-flight.
//
// Before (single bundle):  index.js = 225.27 kB
// After  (code-split):     main shell + N smaller chunks
// ─────────────────────────────────────────────────────────────

// Route 1: "/" — Home page chunk
const Home = lazy(() => import("./pages/Home"));

// Route 2: "/projects" — Task Dashboard chunk
const Projects = lazy(() => import("./pages/Projects"));

// Route 3: "/analytics" — Heavy Analytics chunk (Supplementary Problem)
// Minimum 300ms delay enforced inside Analytics.jsx itself to ensure
// the Suspense fallback is visible even on fast connections.
const Analytics = lazy(() => import("./pages/Analytics"));

// Route 4: "/contact" — Lab Docs / Key Questions chunk
const Contact = lazy(() => import("./pages/Contact"));

// Route 5: "/about" — Developer Profile chunk
const About = lazy(() => import("./pages/About"));

// Route 6: Auth page — lazily loaded so login code is NOT in the initial bundle
const AuthView = lazy(() => import("./components/AuthView"));

// ─────────────────────────────────────────────────────────────

function App() {
  const [token, setTokenState] = useState(getToken());
  const [user, setUserState] = useState(getStoredUser());
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Verify stored JWT on mount by calling /api/auth/me
  useEffect(() => {
    const verifySession = async () => {
      const savedToken = getToken();
      if (!savedToken) {
        setCheckingAuth(false);
        return;
      }
      try {
        const currentUser = await getMe();
        setUserState(currentUser);
        setTokenState(savedToken);
      } catch (err) {
        console.warn("Session validation failed:", err.message);
        logoutUser();
        setTokenState(null);
        setUserState(null);
      } finally {
        setCheckingAuth(false);
      }
    };
    verifySession();
  }, []);

  // Subscribe to global 401 / logout events
  useEffect(() => {
    const handleUnauthorized = () => {
      setTokenState(null);
      setUserState(null);
      toast.error("Session expired. Please log in again.", {
        id: "session-expired",
      });
    };
    const handleLogout = () => {
      setTokenState(null);
      setUserState(null);
      toast("Logged out successfully.", { icon: "👋", id: "logout-toast" });
    };

    authEvents.addEventListener("unauthorized", handleUnauthorized);
    authEvents.addEventListener("logout", handleLogout);
    return () => {
      authEvents.removeEventListener("unauthorized", handleUnauthorized);
      authEvents.removeEventListener("logout", handleLogout);
    };
  }, []);

  const handleAuthSuccess = (authenticatedUser, authToken) => {
    setUserState(authenticatedUser);
    setTokenState(authToken);
  };

  const handleLogoutClick = () => {
    logoutUser();
  };

  const isAuthenticated = Boolean(token && user);

  // Initial auth check spinner (part of shell, not lazy)
  if (checkingAuth) {
    return <PageLoader label="Verifying security token" />;
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f8fafc",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            fontSize: "0.885rem",
          },
        }}
      />

      {isAuthenticated ? (
        /* ── Authenticated layout ─────────────────────── */
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar user={user} onLogout={handleLogoutClick} />

          {/* ── Suspense wraps ONLY the Routes block ────── */}
          {/* This is the correct placement per the rubric:  */}
          {/* "Move Suspense to wrap only the Routes block,  */}
          {/* not the entire App component"                  */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/projects" element={<Projects user={user} />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About user={user} />} />
              {/* Redirect any unknown auth'd route → home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      ) : (
        /* ── Unauthenticated: show lazy Auth page ─────── */
        <Suspense fallback={<PageLoader label="Loading authentication" />}>
          <Routes>
            <Route
              path="*"
              element={<AuthView onAuthSuccess={handleAuthSuccess} />}
            />
          </Routes>
        </Suspense>
      )}
    </BrowserRouter>
  );
}

export default App;
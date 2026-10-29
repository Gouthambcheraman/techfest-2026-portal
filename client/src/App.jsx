import { lazy, Suspense, useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { api } from "./api.js";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Feedback from "./pages/Feedback.jsx";

const Gallery = lazy(() => import("./pages/Gallery.jsx"));

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api("/auth/me").then(setUser).catch(() => setUser(null));
  }, []);

  const logout = async () => {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
    navigate("/");
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link to="/" className="brand" aria-label="TechFest 2026 home">
          <span className="brand-mark" aria-hidden="true">T<span>F</span></span>
          <span className="brand-copy">TECHFEST<span>2026 / CAMPUS EDITION</span></span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <NavLink to="/gallery" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Gallery</NavLink>
          <NavLink to="/feedback" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Feedback</NavLink>
          {user ? (
            <button className="nav-logout" onClick={logout}>Log out <span>({user.name})</span></button>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Log in</NavLink>
              <Link to="/register" className="nav-register">Get your pass <span aria-hidden="true">↗</span></Link>
            </>
          )}
        </nav>
      </header>
      <main className="page-content">
        <Suspense fallback={<div className="loading-state">Getting the good stuff ready…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/feedback" element={<Feedback user={user} />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="*" element={<section className="empty-state"><p className="eyebrow">404 / WRONG TURN</p><h1>This page is off the grid.</h1><Link className="button button-dark" to="/">Back to the main stage <span aria-hidden="true">↗</span></Link></section>} />
          </Routes>
        </Suspense>
      </main>
      <footer className="site-footer">
        <Link to="/" className="footer-brand">TECHFEST<span>2026</span></Link>
        <p>Made for curious minds and big ideas.</p>
        <Link to="/feedback">Leave us a note <span aria-hidden="true">↗</span></Link>
      </footer>
    </div>
  );
}

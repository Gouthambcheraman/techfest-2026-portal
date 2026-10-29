import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const user = await api("/auth/login", { method: "POST", body: { email, password } });
      onLogin(user);
      navigate("/feedback");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-aside auth-aside-login">
        <p className="eyebrow"><span className="live-dot" /> GOOD TO HAVE YOU BACK</p>
        <h1>The next big<br />thing starts<br /><span>with you.</span></h1>
        <p>Pick up where your curiosity left off.</p>
        <span className="auth-aside-mark" aria-hidden="true">✳</span>
      </div>
      <div className="auth-panel">
        <p className="eyebrow">YOUR FESTIVAL PASS</p>
        <h2>Log in</h2>
        <p className="form-intro">Welcome back. Your place in the action is waiting.</p>
        <form onSubmit={submit}>
          <label className="field-label" htmlFor="login-email">Email address</label>
          <input id="login-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label className="field-label" htmlFor="login-password">Password</label>
          <input id="login-password" type="password" autoComplete="current-password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="error form-error" role="alert">{error}</p>}
          <button type="submit" className="button button-dark form-submit">Log in <span aria-hidden="true">↗</span></button>
        </form>
        <p className="auth-switch">New around here? <Link to="/register">Get your pass</Link></p>
      </div>
    </section>
  );
}

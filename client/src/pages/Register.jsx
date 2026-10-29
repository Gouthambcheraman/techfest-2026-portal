import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api("/auth/register", { method: "POST", body: form });
      navigate("/login");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-aside auth-aside-register">
        <p className="eyebrow"><span className="live-dot" /> YOUR INVITATION, SORTED</p>
        <h1>Make room<br />for a little<br /><span>magic.</span></h1>
        <p>One sign-up. A front-row seat to what’s next.</p>
        <span className="auth-aside-mark" aria-hidden="true">✳</span>
      </div>
      <div className="auth-panel">
        <p className="eyebrow">YOUR FESTIVAL PASS</p>
        <h2>Get your pass</h2>
        <p className="form-intro">Create your account and join the curious.</p>
        <form onSubmit={submit}>
          <label className="field-label" htmlFor="register-name">Your name</label>
          <input id="register-name" autoComplete="name" placeholder="How should we call you?" value={form.name} onChange={set("name")} minLength={2} maxLength={60} required />
          <label className="field-label" htmlFor="register-email">Email address</label>
          <input id="register-email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
          <label className="field-label" htmlFor="register-password">Create a password</label>
          <input id="register-password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={form.password} onChange={set("password")} minLength={8} maxLength={72} required />
          {error && <p className="error form-error" role="alert">{error}</p>}
          <button type="submit" className="button button-dark form-submit">Create your account <span aria-hidden="true">↗</span></button>
        </form>
        <p className="auth-switch">Already have a pass? <Link to="/login">Log in</Link></p>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export default function Feedback({ user }) {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = () => api("/feedback").then(setItems).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api("/feedback", { method: "POST", body: { message } });
      setMessage("");
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section className="subpage feedback-page">
      <div className="subpage-intro">
        <p className="eyebrow"><span className="live-dot" /> THE FLOOR IS YOURS</p>
        <h1>Good ideas<br /><span>travel both ways.</span></h1>
        <p>Tell us what you loved, what you imagined, or what we should dream up next.</p>
      </div>
      <div className="feedback-layout">
        <div className="feedback-compose">
          <div className="compose-label"><span>THE SUGGESTION BOX</span><span>✳</span></div>
          {user ? (
            <form onSubmit={submit}>
              <label className="field-label" htmlFor="feedback-message">What’s on your mind, {user.name}?</label>
              <textarea id="feedback-message" maxLength={500} placeholder="The best part was… / Next time, you should…" value={message} onChange={(e) => setMessage(e.target.value)} required />
              <div className="compose-bottom"><span>{message.length} / 500</span><button type="submit" className="button button-dark">Send it <span aria-hidden="true">↗</span></button></div>
            </form>
          ) : (
            <div className="login-prompt"><h2>Have a thought to share?</h2><p>Log in to add your voice to the conversation.</p><Link className="button button-dark" to="/login">Log in to share <span aria-hidden="true">↗</span></Link></div>
          )}
          {error && <p className="error form-error" role="alert">{error}</p>}
        </div>
        <div className="feedback-wall">
          <div className="wall-heading"><div><p className="eyebrow">FROM THE COMMUNITY</p><h2>The word on campus.</h2></div><span className="wall-count">{items.length.toString().padStart(2, "0")} NOTES</span></div>
          {items.length ? (
            <div className="feedback-list">
              {items.map((item, index) => (
                <article className="feedback-note" key={item._id}>
                  <span className="note-number">/{(index + 1).toString().padStart(2, "0")}</span>
                  <div><p>{item.message}</p><span className="note-author">{item.user?.name || "Guest"} <span>·</span> TECHFEST ’26</span></div>
                </article>
              ))}
            </div>
          ) : <p className="empty-feedback">No notes yet. This wall is yours to start.</p>}
        </div>
      </div>
    </section>
  );
}

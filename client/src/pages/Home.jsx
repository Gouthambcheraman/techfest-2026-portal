import { Link } from "react-router-dom";

const highlights = [
  { number: "01", title: "Build what's next", copy: "A 24-hour hackathon for ideas that deserve to exist.", tag: "HACKATHON" },
  { number: "02", title: "Think in motion", copy: "Get hands-on with robotics, hardware and the unexpected.", tag: "ROBO RACE" },
  { number: "03", title: "Make it matter", copy: "Put your sharpest ideas to the test with people who get it.", tag: "DESIGN JAM" },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> THE CAMPUS, REIMAGINED</p>
          <h1>Ideas don’t<br />sit still<span className="hero-period">.</span></h1>
          <p className="hero-description">One campus. A thousand possibilities. Two days to turn your “what if?” into “what’s next?”</p>
          <div className="hero-actions">
            <Link to="/register" className="button button-lime">Get your pass <span aria-hidden="true">↗</span></Link>
            <Link to="/gallery" className="text-link">Explore the festival <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="hero-meta"><span>TECHFEST ’26</span><span className="meta-rule" /><span>MADE FOR THE NEXT</span></div>
        </div>
        <div className="hero-art-wrap">
          <img className="hero-art" src="/techfest-hero.svg" alt="Abstract neon sculpture and sound waves at a night-time technology festival" />
          <div className="art-stamp"><span>IDEAS<br />INTO<br />ORBIT</span><span className="stamp-star" aria-hidden="true">✳</span></div>
          <div className="art-caption"><span>THE FUTURE IS A GROUP PROJECT</span><span>01 — 06</span></div>
        </div>
        <div className="hero-side-note">TECH · DESIGN · CULTURE</div>
      </section>

      <section className="ticker" aria-label="Festival themes">
        <div className="ticker-track"><span>MAKE SOMETHING REAL</span><i>✳</i><span>MEET YOUR PEOPLE</span><i>✳</i><span>BREAK THE ROUTINE</span><i>✳</i><span>MAKE SOMETHING REAL</span><i>✳</i><span>MEET YOUR PEOPLE</span><i>✳</i><span>BREAK THE ROUTINE</span><i>✳</i></div>
      </section>

      <section className="highlights section-pad">
        <div className="section-heading">
          <div><p className="eyebrow">NOT YOUR USUAL TECH FEST</p><h2>Come for the spark.<br /><span>Stay for what it starts.</span></h2></div>
          <p className="section-aside">A little competition. A lot of collaboration. Absolutely no sitting on the sidelines.</p>
        </div>
        <div className="highlight-grid">
          {highlights.map((item) => (
            <article className="highlight-card" key={item.number}>
              <div className="card-topline"><span>{item.number} / 03</span><span className="card-star" aria-hidden="true">✳</span></div>
              <p className="card-tag">{item.tag}</p>
              <h3>{item.title}</h3>
              <p className="card-copy">{item.copy}</p>
              <span className="card-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-cta">
        <div><p className="eyebrow">YOUR PEOPLE ARE HERE</p><h2>Bring your curiosity.<br /><span>We’ll bring the coffee.</span></h2></div>
        <Link to="/register" className="button button-dark">Save your spot <span aria-hidden="true">↗</span></Link>
        <span className="cta-decoration" aria-hidden="true">✳</span>
      </section>
    </>
  );
}

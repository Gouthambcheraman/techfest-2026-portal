const events = [
  { name: "Hackathon", type: "BUILD / 24 HOURS", image: "gallery-hackathon.svg", description: "Teams turning late-night ideas into real prototypes." },
  { name: "Robo Race", type: "MOVE / MACHINES", image: "gallery-robo.svg", description: "A colorful race between student-built robots." },
  { name: "Code Quest", type: "THINK / PLAY", image: "gallery-code.svg", description: "Code, puzzles and a race against the clock." },
  { name: "Design Jam", type: "MAKE / TOGETHER", image: "gallery-design.svg", description: "Creative minds sketching and making together." },
  { name: "Quiz Night", type: "KNOW / YOUR STUFF", image: "gallery-quiz.svg", description: "A lively team quiz under the festival lights." },
  { name: "Cyber Challenge", type: "TEST / YOUR SKILLS", image: "gallery-cyber.svg", description: "A focused challenge for curious cybersecurity students." },
];

export default function Gallery() {
  return (
    <section className="subpage gallery-page">
      <div className="subpage-intro">
        <p className="eyebrow"><span className="live-dot" /> A LOOK INSIDE</p>
        <h1>Small moments.<br /><span>Big energy.</span></h1>
        <p>Every great idea has a before. Here’s what happens when a campus full of curious people gets in the same room.</p>
      </div>
      <div className="gallery-grid">
        {events.map((event, index) => (
          <figure className={`gallery-card gallery-card-${index + 1}`} key={event.name}>
            <div className="gallery-image-wrap">
              <img src={`/${event.image}`} alt={event.description} width="720" height="480" loading="lazy" />
              <span className="gallery-index">0{index + 1}</span>
            </div>
            <figcaption><div><span className="card-tag">{event.type}</span><h2>{event.name}</h2></div><span className="gallery-arrow" aria-hidden="true">↗</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

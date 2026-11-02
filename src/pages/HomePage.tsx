import { ArrowDownRight, ArrowRight, Cpu, Music2, Sparkles, Wrench } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { EventCard } from '../components/EventCard';
import { GalleryCard } from '../components/GalleryCard';
import { SectionHeading } from '../components/SectionHeading';
import { galleryImages } from '../data/gallery';

const highlights = [
  { icon: Cpu, title: 'Technical events', description: 'Build, experiment, and show what happens when smart ideas meet bold execution.' },
  { icon: Wrench, title: 'Hands-on workshops', description: 'Learn something new from people who love sharing what they know.' },
  { icon: Music2, title: 'Cultural moments', description: 'A celebration of the talent, traditions, and people that make our campus.' },
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-content page-container">
          <div className="hero-copy">
            <span className="hero-badge"><span /> Annual College TechFest</span>
            <h1>Where Technology<br />Meets <span>Creativity</span></h1>
            <p>A campus comes alive when curious minds get together. Explore new ideas, meet your people, and make something worth remembering.</p>
            <div className="hero-actions">
              <Button to="/gallery">Explore gallery <ArrowRight size={17} /></Button>
              <Button to="/feedback" variant="light">Share feedback <ArrowDownRight size={17} /></Button>
            </div>
            <div className="hero-footnote"><Sparkles size={15} /> Made by students, for the curious.</div>
          </div>
          <div className="hero-caption"><span>Ideas in motion</span><span>01 — 04</span></div>
        </div>
        <a href="#about" className="hero-scroll" aria-label="Scroll to about section"><span>SCROLL TO EXPLORE</span><span className="scroll-line" /></a>
      </section>

      <section className="about-section page-container" id="about">
        <div className="about-kicker"><span className="eyebrow">A LITTLE ABOUT US</span><span className="about-line" /></div>
        <div className="about-content">
          <h2>More than an event.<br /><span>A spark for what’s next.</span></h2>
          <div>
            <p>TechFest is our annual invitation to think bigger, try something new, and connect with people who are just as curious as you are. One campus, a hundred ideas, and a few days that stay with you long after they’re over.</p>
            <Link to="/gallery" className="text-link">See the moments <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="highlights-section">
        <div className="page-container">
          <SectionHeading eyebrow="WHAT TO EXPECT" title="Something for every kind of curious." description="From the first idea to the final encore, there’s a little something for everyone." />
          <div className="event-grid">
            {highlights.map((item, index) => (
              <EventCard key={item.title} icon={item.icon} title={item.title} description={item.description} number={`0${index + 1}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-gallery page-container">
        <div className="gallery-heading-row">
          <SectionHeading eyebrow="THE GOOD STUFF" title="A few moments, captured." description="Little glimpses of the energy, the ideas, and all the in-between." />
          <Link to="/gallery" className="text-link gallery-all-link">See the full gallery <ArrowRight size={16} /></Link>
        </div>
        <div className="preview-grid">
          {galleryImages.slice(0, 4).map((image) => (
            <GalleryCard key={image.id} image={image} onClick={() => navigate('/gallery')} />
          ))}
        </div>
        <Link to="/gallery" className="mobile-gallery-link text-link">Explore all moments <ArrowRight size={16} /></Link>
      </section>

      <section className="closing-cta">
        <div className="page-container closing-cta-inner">
          <div><span className="eyebrow">YOUR TURN</span><h2>Be part of the next big idea.</h2><p>Share what made your TechFest memorable.</p></div>
          <Button to="/feedback" variant="light">Leave feedback <ArrowRight size={17} /></Button>
        </div>
      </section>
    </>
  );
}

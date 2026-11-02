import { ArrowUpRight, Instagram, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="brand brand-footer" to="/">
            <span className="brand-mark"><span>✳</span></span>
            <span>techfest<span className="brand-period">.</span></span>
          </Link>
          <p>Curiosity, creativity, and a campus full of possibility.</p>
        </div>
        <div className="footer-col">
          <h3>Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/feedback">Feedback</Link>
        </div>
        <div className="footer-col">
          <h3>Get in touch</h3>
          <p>College Name</p>
          <a href="mailto:techfest@college.edu"><Mail size={15} /> techfest@college.edu</a>
          <p>City, State · India</p>
        </div>
        <div className="footer-col">
          <h3>Follow along</h3>
          <div className="social-links">
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a href="mailto:techfest@college.edu" aria-label="Email us"><ArrowUpRight size={18} /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} College TechFest. Made for curious minds.</span>
        <span>Annual College TechFest</span>
      </div>
    </footer>
  );
}

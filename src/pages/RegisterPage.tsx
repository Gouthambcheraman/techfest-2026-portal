import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {
  return (
    <main className="auth-page">
      <div className="auth-visual auth-visual-register">
        <Link className="auth-back" to="/"><ArrowLeft size={16} /> Back to home</Link>
        <div className="auth-visual-copy">
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <h2>Find your people. Follow your curiosity.</h2>
          <p>Make an account to share feedback and be part of a campus-wide celebration of ideas.</p>
        </div>
        <span className="auth-visual-mark">TECHFEST · ANNUAL EDITION</span>
      </div>
      <div className="auth-form-wrap"><RegisterForm /></div>
    </main>
  );
}

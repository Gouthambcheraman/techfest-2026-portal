import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-visual auth-visual-login">
        <Link className="auth-back" to="/"><ArrowLeft size={16} /> Back to home</Link>
        <div className="auth-visual-copy">
          <span className="eyebrow">IDEAS IN MOTION</span>
          <h2>Good things happen when curious minds meet.</h2>
          <p>Sign in to share your experience and stay part of the conversation.</p>
        </div>
        <span className="auth-visual-mark">TECHFEST · ANNUAL EDITION</span>
      </div>
      <div className="auth-form-wrap"><LoginForm /></div>
    </main>
  );
}

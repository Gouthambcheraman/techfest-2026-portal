import { Navigate } from 'react-router-dom';
import { FeedbackForm } from '../components/FeedbackForm';
import { useAuth } from '../context/AuthContext';

export function FeedbackPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <main className="auth-loading" aria-live="polite">Checking your session...</main>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: '/feedback' }} />;
  }

  return (
    <main className="page-container feedback-page">
      <div className="page-intro feedback-intro">
        <span className="eyebrow">HELP US GROW</span>
        <h1>Tell us what <span>you think.</span></h1>
        <p>Good events are built together. Your honest feedback helps shape what comes next.</p>
      </div>
      <FeedbackForm user={user} />
    </main>
  );
}

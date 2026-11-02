import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api, getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types';
import { Button } from './Button';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = (location.state as { from?: string } | null)?.from || '/';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post<{ user: User }>('/auth/login', { email: email.trim(), password });
      setUser(data.user);
      navigate(destination, { replace: true });
    } catch (submitError) {
      setError(getErrorMessage(submitError, 'Unable to log in. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form-card auth-card" onSubmit={handleSubmit}>
      <div className="form-card-heading">
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Log in to TechFest</h1>
        <p>Pick up where your curiosity left off.</p>
      </div>
      <label className="field-label" htmlFor="email">Email address</label>
      <input id="email" className="form-control" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <label className="field-label" htmlFor="password">Password</label>
      <input id="password" className="form-control" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      {error && <p className="form-message form-message-error" role="alert">{error}</p>}
      <Button type="submit" className="form-submit" disabled={submitting}>
        {submitting ? 'Logging in...' : <>Log in <ArrowRight size={17} /></>}
      </Button>
      <p className="form-switch">New to TechFest? <Link to="/register">Create an account</Link></p>
    </form>
  );
}

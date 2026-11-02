import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api, getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types';
import { Button } from './Button';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Your password must be at least 8 characters.');
      return;
    }
    if (password.length > 72) {
      setError('Your password must be no more than 72 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post<{ user: User }>('/auth/register', { name: name.trim(), email: email.trim(), password });
      setUser(data.user);
      navigate('/');
    } catch (submitError) {
      setError(getErrorMessage(submitError, 'Unable to create your account. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form-card auth-card" onSubmit={handleSubmit}>
      <div className="form-card-heading">
        <span className="eyebrow">JOIN THE FEST</span>
        <h1>Create your account</h1>
        <p>Be part of the ideas, energy, and experiences.</p>
      </div>
      <label className="field-label" htmlFor="name">Full name</label>
      <input id="name" className="form-control" type="text" autoComplete="name" minLength={2} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} required />
      <label className="field-label" htmlFor="register-email">Email address</label>
      <input id="register-email" className="form-control" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <label className="field-label" htmlFor="register-password">Password</label>
      <input id="register-password" className="form-control" type="password" autoComplete="new-password" minLength={8} maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} required />
      <label className="field-label" htmlFor="confirm-password">Confirm password</label>
      <input id="confirm-password" className="form-control" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
      {error && <p className="form-message form-message-error" role="alert">{error}</p>}
      <Button type="submit" className="form-submit" disabled={submitting}>
        {submitting ? 'Creating account...' : <>Create account <ArrowRight size={17} /></>}
      </Button>
      <p className="form-switch">Already have an account? <Link to="/login">Log in</Link></p>
    </form>
  );
}

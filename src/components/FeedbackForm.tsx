import { useEffect, useState, type FormEvent } from 'react';
import { Star } from 'lucide-react';
import { api, getErrorMessage } from '../api/client';
import type { FeedbackEntry, User } from '../types';
import { Button } from './Button';

const categories = ['Technical Events', 'Workshops', 'Cultural Activities', 'Competitions', 'General'];

export function FeedbackForm({ user }: { user: User }) {
  const [category, setCategory] = useState(categories[0]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [historyError, setHistoryError] = useState('');

  useEffect(() => {
    api.get<{ feedback: FeedbackEntry[] }>('/feedback/my')
      .then(({ data }) => setEntries(data.feedback))
      .catch((loadError: unknown) => setHistoryError(getErrorMessage(loadError, 'Your past feedback could not be loaded.')));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!rating) {
      setError('Please choose a rating from 1 to 5 stars.');
      return;
    }
    if (message.trim().length < 10) {
      setError('Please write at least 10 characters of feedback.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post<{ feedback: FeedbackEntry }>('/feedback', {
        category,
        rating,
        message: message.trim(),
      });
      setEntries((current) => [data.feedback, ...current]);
      setMessage('');
      setRating(0);
      setSuccess('Thank you — your feedback has been submitted.');
    } catch (submitError) {
      setError(getErrorMessage(submitError, 'Your feedback could not be submitted. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="feedback-layout">
      <form className="form-card feedback-card" onSubmit={handleSubmit} noValidate>
        <div className="form-card-heading">
          <span className="eyebrow">YOUR VOICE MATTERS</span>
          <h2>Share your thoughts</h2>
          <p>Tell us what you loved and what we can make even better.</p>
        </div>
        <div className="feedback-identity">
          <div>
            <label className="field-label" htmlFor="feedback-name">Name</label>
            <input id="feedback-name" className="form-control" value={user.name} readOnly />
          </div>
          <div>
            <label className="field-label" htmlFor="feedback-email">Email</label>
            <input id="feedback-email" className="form-control" type="email" value={user.email} readOnly />
          </div>
        </div>
        <p className="identity-hint">These details come from your account and are not editable here.</p>
        <label className="field-label" htmlFor="category">What is your feedback about?</label>
        <select id="category" className="form-control" value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((option) => <option key={option}>{option}</option>)}
        </select>

        <fieldset className="rating-field">
          <legend className="field-label">How was your experience?</legend>
          <div className="rating-stars" onMouseLeave={() => setHoverRating(0)} role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                className={`rating-star${value <= (hoverRating || rating) ? ' rating-star-active' : ''}`}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`}
                onMouseEnter={() => setHoverRating(value)}
                onFocus={() => setHoverRating(value)}
                onBlur={() => setHoverRating(0)}
                onClick={() => setRating(value)}
              >
                <Star size={26} fill="currentColor" />
              </button>
            ))}
            <span className="rating-caption">{rating ? `${rating} out of 5` : 'Select a rating'}</span>
          </div>
        </fieldset>

        <label className="field-label" htmlFor="message">Your feedback</label>
        <textarea
          id="message"
          className="form-control form-textarea"
          placeholder="What stood out to you? Share a few details..."
          value={message}
          maxLength={2000}
          onChange={(event) => setMessage(event.target.value)}
          required
        />
        <div className="form-hint">{message.length}/2000 characters · At least 10 characters</div>
        {error && <p className="form-message form-message-error" role="alert">{error}</p>}
        {success && <p className="form-message form-message-success" role="status">{success}</p>}
        <Button type="submit" className="form-submit" disabled={submitting}>
          {submitting ? 'Sending feedback...' : 'Submit feedback'}
        </Button>
        <p className="form-privacy">Your feedback is saved securely to your account.</p>
      </form>

      <aside className="feedback-aside">
        <span className="eyebrow">A BETTER FEST, TOGETHER</span>
        <h2>Every note helps us make the next one better.</h2>
        <p>Your feedback is connected to your account so you can keep track of what you have shared.</p>
        <div className="feedback-history">
          <h3>Your recent feedback</h3>
          {historyError ? <p className="history-error" role="alert">{historyError}</p> : entries.length ? (
            entries.slice(0, 3).map((entry) => (
              <article className="history-entry" key={entry._id}>
                <div><strong>{entry.category}</strong><span>{'★'.repeat(entry.rating)}<span className="muted-stars">{'★'.repeat(5 - entry.rating)}</span></span></div>
                <p>{entry.message}</p>
                <time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleDateString()}</time>
              </article>
            ))
          ) : <p className="history-empty">Your submitted feedback will appear here.</p>}
        </div>
      </aside>
    </div>
  );
}

import type { LucideIcon } from 'lucide-react';

type EventCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  number: string;
};

export function EventCard({ icon: Icon, title, description, number }: EventCardProps) {
  return (
    <article className="event-card">
      <div className="event-card-top">
        <span className="event-icon"><Icon size={22} strokeWidth={1.8} /></span>
        <span className="event-number">{number}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

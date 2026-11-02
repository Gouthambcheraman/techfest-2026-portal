import { Link } from 'react-router-dom';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'light';
  to?: string;
};

export function Button({ children, variant = 'primary', to, className = '', ...props }: ButtonProps) {
  const classes = `button button-${variant} ${className}`;
  if (to) {
    return <Link className={classes} to={to}>{children}</Link>;
  }
  return <button className={classes} {...props}>{children}</button>;
}

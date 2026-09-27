import React from 'react';
import { Link } from 'react-router-dom';

const cls = 'text-xs font-bold text-brand-green hover:text-brand-deep transition-colors whitespace-nowrap';

export default function LinkAction({ to, onClick, children }) {
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  return <button type="button" onClick={onClick} className={cls}>{children}</button>;
}
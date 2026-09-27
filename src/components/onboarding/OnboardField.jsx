import React from 'react';

export default function OnboardField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-brand-ink mb-1.5">{label}</label>
      {children}
    </div>
  );
}
import React from 'react';
import { Input } from '@/components/ui/input';

export default function AuthField({ label, value, onChange, right, ...props }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold text-brand-ink">{label}</label>
        {right}
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-lg bg-white border-brand-line focus-visible:ring-brand-green/30"
        {...props}
      />
    </div>
  );
}
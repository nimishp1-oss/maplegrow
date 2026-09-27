import React from 'react';
import BarRow from '@/components/shared/BarRow';
import { DEBT_PATHS, money } from '@/lib/finance';

export default function DebtPaths() {
  const max = Math.max(...DEBT_PATHS.map((p) => p.value));
  return (
    <div className="grid gap-3.5">
      {DEBT_PATHS.map((p) => (
        <BarRow key={p.name} name={p.name} pct={(p.value / max) * 100} value={money(p.value)} color={p.color} />
      ))}
    </div>
  );
}
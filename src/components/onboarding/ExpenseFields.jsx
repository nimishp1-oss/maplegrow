import React from 'react';
import { Input } from '@/components/ui/input';
import OnboardField from '@/components/onboarding/OnboardField';
import { EXPENSES, budget, money } from '@/lib/finance';

export default function ExpenseFields({ form, set }) {
  const b = budget(form);
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {EXPENSES.map((e) => (
          <OnboardField key={e.key} label={e.label}>
            <Input className="h-11" type="number" min="0" value={form[e.key]} onChange={(ev) => set(e.key, ev.target.value)} />
          </OnboardField>
        ))}
      </div>
      <div className="bg-[#f5f5f7] rounded-xl px-5 py-4 flex justify-between items-center mt-5">
        <span className="text-xs text-[#6e6e73]">
          Available to save each month<br />
          <small>{money(b.income)} income − {money(b.spent)} expenses</small>
        </span>
        <strong className={`font-heading font-extrabold text-2xl ${b.available >= 0 ? 'text-brand-green' : 'text-red-600'}`}>{money(b.available)}</strong>
      </div>
    </>
  );
}
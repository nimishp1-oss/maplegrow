import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EXPENSES, money } from '@/lib/finance';

export default function OnboardTransactions({ items, setItems }) {
  const [tx, setTx] = useState({ name: '', amount: '', category: 'Housing' });

  const add = () => {
    if (!tx.name.trim() || !(Number(tx.amount) > 0)) return;
    setItems([...items, { ...tx, name: tx.name.trim(), amount: Number(tx.amount) }]);
    setTx({ ...tx, name: '', amount: '' });
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-[1fr_120px_170px_auto] gap-2">
        <Input className="col-span-2 sm:col-span-1" placeholder="e.g. Campus bookstore" value={tx.name} onChange={(e) => setTx({ ...tx, name: e.target.value })} />
        <Input type="number" min="0" placeholder="Amount ($)" value={tx.amount} onChange={(e) => setTx({ ...tx, amount: e.target.value })} />
        <Select value={tx.category} onValueChange={(v) => setTx({ ...tx, category: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{EXPENSES.map((e) => <SelectItem key={e.key} value={e.label}>{e.label}</SelectItem>)}</SelectContent>
        </Select>
        <button type="button" onClick={add} className="col-span-2 sm:col-span-1 h-10 px-4 rounded-lg bg-brand-green text-white text-sm font-bold">Add</button>
      </div>
      <div className="mt-3 text-xs text-[#6e6e73]">
        {items.map((t, i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-brand-line">
            <span>{t.name} · {t.category}</span>
            <span className="flex items-center gap-2"><b>−{money(t.amount)}</b>
              <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))} className="text-[#86868b] hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
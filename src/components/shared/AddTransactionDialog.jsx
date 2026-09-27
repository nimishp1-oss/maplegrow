import React, { useState } from 'react';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES } from '@/lib/finance';

export default function AddTransactionDialog({ open, onOpenChange, onSave }) {
  const [form, setForm] = useState({ name: '', amount: '', category: 'Others', date: format(new Date(), 'yyyy-MM-dd') });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ ...form, amount: Number(form.amount), type: form.category === 'Income' ? 'income' : 'expense' });
    setSaving(false);
    setForm((f) => ({ ...f, name: '', amount: '' }));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader><DialogTitle className="font-heading">Add a transaction</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          <Input placeholder="e.g. Campus bookstore" value={form.name} onChange={(e) => set('name', e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <Input type="number" min="0.01" step="0.01" placeholder="Amount ($)" value={form.amount} onChange={(e) => set('amount', e.target.value)} required />
            <Input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} required />
          </div>
          <Select value={form.category} onValueChange={(v) => set('category', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <button disabled={saving} className="h-11 rounded-xl bg-brand-green text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save transaction
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
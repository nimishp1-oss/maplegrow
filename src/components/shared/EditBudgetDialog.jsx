import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { EXPENSES } from '@/lib/finance';

const FIELDS = [
  { key: 'monthly_income', label: 'Monthly income' },
  { key: 'education_debt', label: 'Education debt' },
  ...EXPENSES,
];

export default function EditBudgetDialog({ open, onOpenChange, profile, onSave }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(Object.fromEntries(FIELDS.map((f) => [f.key, profile[f.key] ?? 0])));
  }, [open, profile]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(Object.fromEntries(Object.entries(form).map(([k, v]) => [k, Number(v) || 0])));
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader><DialogTitle className="font-heading">Edit your budget</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            {FIELDS.map((f) => (
              <label key={f.key} className="text-xs font-bold text-brand-ink">
                {f.label}
                <Input type="number" min="0" className="mt-1.5 font-normal" value={form[f.key] ?? ''} onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))} />
              </label>
            ))}
          </div>
          <button disabled={saving} className="h-11 rounded-xl bg-brand-green text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save budget
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
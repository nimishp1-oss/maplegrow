import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ALLOCATION } from '@/lib/finance';

export default function EditMixDialog({ open, onOpenChange, profile, onSave }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(Object.fromEntries(ALLOCATION.map((a) => [a.key, profile[a.key] ?? 0])));
  }, [open, profile]);

  const total = ALLOCATION.reduce((s, a) => s + (Number(form[a.key]) || 0), 0);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(Object.fromEntries(ALLOCATION.map((a) => [a.key, Number(form[a.key]) || 0])));
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-2xl">
        <DialogHeader><DialogTitle className="font-heading">Edit example mix</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-3">
          {ALLOCATION.map((a) => (
            <label key={a.key} className="flex items-center justify-between gap-3 text-sm">
              {a.label}
              <Input type="number" min="0" max="100" className="w-24" value={form[a.key] ?? ''} onChange={(e) => setForm((s) => ({ ...s, [a.key]: e.target.value }))} />
            </label>
          ))}
          <p className={`text-xs ${total === 100 ? 'text-brand-green' : 'text-red-600'}`}>Total: {total}% {total !== 100 && '— must equal 100%'}</p>
          <button disabled={saving || total !== 100} className="h-11 rounded-xl bg-brand-green text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save mix
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
import React, { useRef, useState } from 'react';
import { Loader2, UploadCloud } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES, money } from '@/lib/finance';

export default function StatementImportDialog({ open, onOpenChange, onImport }) {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const reset = () => {
    setRows(null);
    setError('');
    setLoading(false);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    reset();
    setLoading(true);
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri, expires_in: 900 });
      const res = await base44.functions.invoke('geminiStatementAnalysis', { fileUrl: signed_url });
      const found = res.data?.transactions || [];
      if (!found.length) throw new Error('No transactions could be read from that file.');
      setRows(found);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Could not analyze that file.');
    }
    setLoading(false);
  };

  const confirm = async () => {
    setSaving(true);
    await onImport(rows.map((r) => ({ ...r, type: r.category === 'Income' ? 'income' : 'expense' })));
    setSaving(false);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading">Import a statement</DialogTitle>
          <p className="text-xs text-brand-muted">Upload a credit card or bank statement (PDF or image). Gemini reads each transaction and sorts it into a spending category — you confirm before anything is saved.</p>
        </DialogHeader>

        {!rows && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={loading}
            className="w-full rounded-2xl border-2 border-dashed border-brand-line py-10 grid place-items-center gap-2 text-brand-muted hover:border-brand-green hover:text-brand-green transition-colors disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 className="w-6 h-6 animate-spin" /><span className="text-sm">Gemini is reading your statement…</span></>
            ) : (
              <><UploadCloud className="w-6 h-6" /><span className="text-sm font-semibold">Choose a PDF or image</span></>
            )}
          </button>
        )}
        <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={handleFile} />

        {error && <p className="text-xs font-semibold text-[#c0392b]">{error}</p>}

        {rows && (
          <>
            <div className="grid gap-2 max-h-72 overflow-y-auto pr-1">
              {rows.map((r, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto] gap-2 items-center rounded-xl border border-brand-line px-3 py-2">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-brand-ink truncate">{r.name}</div>
                    <div className="text-[11px] text-brand-muted">{r.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <b className="text-xs tabular-nums text-brand-ink">{money(r.amount)}</b>
                    <Select value={r.category} onValueChange={(v) => setRows((rs) => rs.map((x, xi) => (xi === i ? { ...x, category: v } : x)))}>
                      <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={confirm} disabled={saving} className="h-11 rounded-xl bg-brand-green text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Add {rows.length} transaction{rows.length > 1 ? 's' : ''}
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
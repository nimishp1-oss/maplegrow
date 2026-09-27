import React from 'react';
import { Loader2 } from 'lucide-react';

export default function SubmitButton({ loading, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full h-12 rounded-xl bg-brand-green text-white font-bold text-sm hover:bg-[#0077ed] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
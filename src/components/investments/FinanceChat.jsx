import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import Panel from '@/components/shared/Panel';
import Disclaimer from '@/components/shared/Disclaimer';
import { Input } from '@/components/ui/input';

const SUGGESTIONS = [
  'How can I save more each month?',
  'Is my budget healthy for a student?',
  'How should I balance debt payoff and investing?',
];

export default function FinanceChat({ profile }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const ask = async (question) => {
    const q = (question ?? input).trim();
    if (!q || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const res = await base44.functions.invoke('geminiFinanceChat', { question: q, profile });
      setMessages((m) => [...m, { role: 'bot', text: res.data?.answer || 'I could not answer that — please try again.' }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'bot', text: 'The assistant is unavailable right now. Please try again shortly.' }]);
    }
    setLoading(false);
  };

  return (
    <Panel
      title="Ask Maple AI"
      subtitle="Your in-app finance assistant · grounded in your plan"
      action={<span className="inline-flex items-center gap-1.5 text-[11px] font-bold rounded-full bg-brand-soft text-brand-green px-2.5 py-1"><Sparkles className="w-3 h-3" /> Gemini</span>}
    >
      <div ref={scrollRef} className="grid gap-3 max-h-80 overflow-y-auto pr-1">
        {messages.length === 0 && !loading && (
          <div className="grid gap-2 justify-items-start">
            <p className="text-xs text-brand-muted">Try one of these, or ask anything about budgeting, debt, or investing:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => ask(s)} className="text-xs font-semibold rounded-full border border-brand-line px-3 py-1.5 text-brand-green hover:bg-brand-soft transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-brand-green text-white justify-self-end' : 'bg-brand-soft text-brand-ink justify-self-start'}`}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="justify-self-start bg-brand-soft rounded-2xl px-4 py-2.5">
            <Loader2 className="w-4 h-4 animate-spin text-brand-muted" />
          </div>
        )}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); ask(); }} className="flex gap-2 mt-4">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your money…" className="flex-1 h-11 rounded-xl" />
        <button type="submit" disabled={loading || !input.trim()} className="w-11 h-11 rounded-xl bg-brand-green text-white grid place-items-center disabled:opacity-40">
          <Send className="w-4 h-4" />
        </button>
      </form>
      <Disclaimer className="mt-3">AI guidance is educational only — not financial advice.</Disclaimer>
    </Panel>
  );
}
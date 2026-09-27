import React from 'react';
import { format, parseISO } from 'date-fns';
import { Home, ShoppingBasket, Bus, GraduationCap, Ticket, CircleDot, Wallet, Trash2 } from 'lucide-react';
import { money } from '@/lib/finance';

const ICONS = {
  Housing: Home, 'Food & groceries': ShoppingBasket, Transportation: Bus,
  Education: GraduationCap, Entertainment: Ticket, Others: CircleDot, Income: Wallet,
};

export default function TransactionList({ transactions, onDelete }) {
  if (!transactions.length) {
    return <p className="text-xs text-brand-muted py-6 text-center">No transactions yet. Add your first one.</p>;
  }
  return (
    <div className="divide-y divide-brand-line">
      {transactions.map((t) => {
        const Icon = ICONS[t.category] || CircleDot;
        const income = t.type === 'income';
        return (
          <div key={t.id} className="group flex items-center justify-between py-2.5 text-xs">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-8 h-8 rounded-lg bg-[#f5f5f7] grid place-items-center text-brand-green shrink-0">
                <Icon className="w-3.5 h-3.5" />
              </span>
              <div className="min-w-0">
                <div className="text-[#1d1d1f] font-medium truncate">{t.name}</div>
                <small className="text-[#86868b]">{t.category}{t.date ? ` · ${format(parseISO(t.date), 'MMM d')}` : ''}</small>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-bold tabular-nums ${income ? 'text-brand-green' : 'text-brand-ink'}`}>
                {income ? '+' : '−'}{money(t.amount)}
              </span>
              {onDelete && (
                <button onClick={() => onDelete(t.id)} className="opacity-0 group-hover:opacity-100 transition text-[#86868b] hover:text-red-500" aria-label="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
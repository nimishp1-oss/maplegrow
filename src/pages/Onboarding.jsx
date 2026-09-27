import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import useFinanceData from '@/hooks/useFinanceData';
import Logo from '@/components/brand/Logo';
import FullSpinner from '@/components/shared/FullSpinner';
import ProfileFields from '@/components/onboarding/ProfileFields';
import ExpenseFields from '@/components/onboarding/ExpenseFields';
import OnboardTransactions from '@/components/onboarding/OnboardTransactions';

const Section = ({ title, hint, children }) => (
  <div className="mt-7 pt-6 border-t border-brand-line">
    <h3 className="font-heading font-bold text-sm">{title}</h3>
    {hint && <p className="text-xs text-brand-muted mt-1">{hint}</p>}
    <div className="mt-4">{children}</div>
  </div>
);

export default function Onboarding() {
  const { user, profile, isLoading, refreshProfile, refreshTx } = useFinanceData();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [txs, setTxs] = useState([]);
  const [form, setForm] = useState({
    full_name: user?.full_name || '', phone: '', school_year: 'College junior', monthly_income: 3200, education_debt: 28500,
    expense_housing: 790, expense_food: 492, expense_transport: 394, expense_education: 344, expense_entertainment: 180, expense_others: 260,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  if (isLoading) return <FullSpinner />;
  if (profile) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const numeric = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, typeof v === 'string' && !['full_name', 'phone', 'school_year'].includes(k) ? Number(v) || 0 : v]));
    await base44.entities.FinanceProfile.create(numeric);
    if (txs.length) {
      const today = format(new Date(), 'yyyy-MM-dd');
      await base44.entities.Transaction.bulkCreate(txs.map((t) => ({ ...t, type: 'expense', date: today })));
    }
    await Promise.all([refreshProfile(), refreshTx()]);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-paper px-4 sm:px-6 pb-14">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center py-6">
          <Logo />
          <div className="text-xs text-brand-muted"><b className="text-brand-green">01</b> Profile & budget <span className="mx-2">→</span> 02 Your overview</div>
        </header>
        <motion.form onSubmit={submit} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-brand-line rounded-3xl p-6 sm:p-9 shadow-[0_12px_35px_rgba(0,0,0,0.05)]">
          <h1 className="font-heading font-extrabold text-[26px] tracking-tight">Let's build your money picture.</h1>
          <p className="text-sm text-brand-muted mt-1.5 mb-7">Start with a few details. You can update them any time in your plan.</p>
          <ProfileFields form={form} set={set} email={user?.email} />
          <Section title="Monthly expenses"><ExpenseFields form={form} set={set} /></Section>
          <Section title="Add a transaction" hint="Optional — enter a recent purchase now, or add more later."><OnboardTransactions items={txs} setItems={setTxs} /></Section>
          <div className="flex justify-end mt-8">
            <button disabled={saving} className="h-12 px-6 rounded-xl bg-brand-green text-white font-bold text-sm flex items-center gap-2 hover:bg-[#0077ed] transition disabled:opacity-60">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Create my plan & see overview →
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
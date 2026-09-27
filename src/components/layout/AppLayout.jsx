import React, { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import useFinanceData from '@/hooks/useFinanceData';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import FullSpinner from '@/components/shared/FullSpinner';

export default function AppLayout() {
  const data = useFinanceData();
  const { pathname } = useLocation();
  const [draft, setDraft] = useState({});

  if (data.isLoading) return <FullSpinner />;
  if (!data.profile) return <Navigate to="/onboarding" replace />;

  const p = data.profile;
  const scenario = {
    monthly_contribution: draft.monthly_contribution ?? p.monthly_contribution ?? 300,
    annual_return: draft.annual_return ?? p.annual_return ?? 7,
    years_to_graduation: draft.years_to_graduation ?? p.years_to_graduation ?? 6,
  };

  const context = {
    ...data,
    scenario,
    setScenario: (k, v) => setDraft((d) => ({ ...d, [k]: v })),
    commitScenario: (k, v) => data.updateProfile.mutate({ [k]: v }),
  };

  return (
    <div className="min-h-screen bg-brand-paper">
      <Sidebar profile={p} />
      <main className="ml-16 md:ml-60 px-4 sm:px-6 lg:px-10 pb-14">
        <Topbar />
        <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
          <Outlet context={context} />
        </motion.div>
      </main>
    </div>
  );
}
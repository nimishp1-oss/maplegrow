import React from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import Metric from '@/components/shared/Metric';
import Panel from '@/components/shared/Panel';
import LinkAction from '@/components/shared/LinkAction';
import DebtPaths from '@/components/shared/DebtPaths';
import SpendingDonut from '@/components/shared/SpendingDonut';
import TransactionList from '@/components/shared/TransactionList';
import InvestingPlanCard from '@/components/overview/InvestingPlanCard';
import DebtPayoffCard from '@/components/shared/DebtPayoffCard';
import OutcomeBanner from '@/components/shared/OutcomeBanner';
import Disclaimer from '@/components/shared/Disclaimer';
import { budget, projection, money } from '@/lib/finance';

export default function Overview() {
  const ctx = useOutletContext();
  const { profile, transactions, scenario, updateProfile } = ctx;
  const b = budget(profile);
  const proj = projection(scenario);
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      <PageHeader title={`${greet}, ${profile.full_name.split(' ')[0]} ✦`} subtitle="Here's a clear view of where you are — and where your money could take you." tag="Saved to your account" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Metric label="Est. U.S. student debt" value="$1.81T" note="↑ 3.2% YoY · illustrative" tone="down" />
        <Metric label="Your education debt" value={money(b.debt)} note={profile.school_year} tone="down" />
        <Metric label="Available to save monthly" value={money(b.available)} note="Income minus expenses" tone={b.available >= 0 ? 'up' : 'down'} />
        <Metric label="Monthly savings rate" value={`${b.rate.toFixed(1)}%`} note={b.rate >= 20 ? 'On track · goal 20%' : 'Goal: 20%'} tone={b.rate >= 20 ? 'up' : 'down'} />
      </div>
      <div className="grid lg:grid-cols-[1.25fr_1fr] gap-4 mt-4">
        <Panel title="Student debt, by education path" subtitle="Typical total debt at completion · illustrative" action={<LinkAction to="/plan">Explore data ↗</LinkAction>}>
          <DebtPaths />
          <Disclaimer className="mt-5">Illustrative estimates, not live government statistics. Actual outcomes vary by school and student.</Disclaimer>
        </Panel>
        <Panel title="Monthly spending" subtitle="Your budget, grouped by category" action={<LinkAction to="/finances">See finances →</LinkAction>}>
          <SpendingDonut items={b.items} total={b.spent} />
          <div className="border-t border-brand-line mt-5 pt-2">
            <TransactionList transactions={transactions.slice(0, 3)} />
          </div>
        </Panel>
      </div>
      <div className="mt-4">
        <DebtPayoffCard profile={profile} onSave={updateProfile.mutateAsync} />
      </div>
      <InvestingPlanCard {...ctx} proj={proj} />
      <OutcomeBanner
        title="Graduation day, made more manageable."
        text="A hypothetical view of your investments alongside your education balance."
        stats={[
          { label: 'After-tax investing estimate', value: money(proj.afterTax), note: 'taxable account · estimate' },
          { label: 'Education balance', value: money(b.debt), note: 'from your profile' },
        ]}
        cta={{ label: 'View graduation plan →', to: '/plan' }}
      />
      <Disclaimer className="mt-4">Planning illustration only. Investment returns are uncertain; taxes and aid depend on your circumstances. This is not financial advice.</Disclaimer>
    </div>
  );
}
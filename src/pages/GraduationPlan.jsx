import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { DollarSign, Target, PiggyBank } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import Panel from '@/components/shared/Panel';
import DebtPaths from '@/components/shared/DebtPaths';
import OutcomeBanner from '@/components/shared/OutcomeBanner';
import Disclaimer from '@/components/shared/Disclaimer';
import { budget, projection, money } from '@/lib/finance';

const BASICS = [
  { icon: DollarSign, title: 'Taxable brokerage', text: 'Gains may be taxed when sold; education spending does not automatically exempt them.' },
  { icon: Target, title: '529 education account', text: 'Qualified education distributions may receive favorable federal tax treatment.' },
  { icon: PiggyBank, title: 'Cash savings', text: 'Lower market exposure, though interest and inflation matter.' },
];

export default function GraduationPlan() {
  const { profile, scenario } = useOutletContext();
  const p = projection(scenario);
  const debt = budget(profile).debt;

  return (
    <div>
      <PageHeader title="Your graduation plan" subtitle="Bring the pieces together and explore what may be available when school ends." tag="Illustrative scenario · not a promise" />
      <OutcomeBanner
        title="From consistent saving to more choices."
        text="Compare projected after-tax proceeds with your education balance."
        stats={[
          { label: 'After-tax portfolio estimate', value: money(p.afterTax), note: 'taxable brokerage assumption' },
          { label: 'Education balance', value: money(debt), note: 'principal only · your profile' },
          { label: p.afterTax >= debt ? 'Possible amount remaining' : 'Remaining gap', value: money(p.afterTax - debt), note: 'before other costs or aid' },
        ]}
      />
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <Panel title="Education paths at a glance" subtitle="Illustrative debt at completion, by path">
          <DebtPaths />
          <Disclaimer className="mt-5">Mock comparison values, not current official averages.</Disclaimer>
        </Panel>
        <Panel title="Tax and account basics" subtitle="Account type can change what you keep">
          <div className="divide-y divide-brand-line">
            {BASICS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3 py-3">
                <span className="w-8 h-8 rounded-lg bg-[#f5f5f7] grid place-items-center text-brand-green shrink-0"><Icon className="w-4 h-4" /></span>
                <div><div className="text-sm font-semibold">{title}</div><p className="text-xs text-brand-muted mt-0.5 leading-relaxed">{text}</p></div>
              </div>
            ))}
          </div>
          <Disclaimer className="mt-3">Tax treatment varies by account, state, and circumstances. Confirm details with a qualified tax professional.</Disclaimer>
        </Panel>
      </div>
      <Disclaimer className="mt-4">Every figure on this page is a planning illustration, not an offer, forecast, or financial advice.</Disclaimer>
    </div>
  );
}
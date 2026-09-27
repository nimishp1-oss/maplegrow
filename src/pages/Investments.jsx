import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import Metric from '@/components/shared/Metric';
import Panel from '@/components/shared/Panel';
import LinkAction from '@/components/shared/LinkAction';
import ProjectionSliders from '@/components/shared/ProjectionSliders';
import AllocationList from '@/components/shared/AllocationList';
import EditMixDialog from '@/components/shared/EditMixDialog';
import OutcomeBanner from '@/components/shared/OutcomeBanner';
import Disclaimer from '@/components/shared/Disclaimer';
import FinanceChat from '@/components/investments/FinanceChat';
import { projection, money } from '@/lib/finance';

export default function Investments() {
  const { profile, scenario, setScenario, commitScenario, updateProfile } = useOutletContext();
  const [mixOpen, setMixOpen] = useState(false);
  const p = projection(scenario);

  return (
    <div>
      <PageHeader title="Investments" subtitle="Explore how a regular contribution could grow over your college years." tag="Hypothetical projection" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Metric label="Monthly contribution" value={money(scenario.monthly_contribution)} note="Recurring investment" />
        <Metric label="Total contributed" value={money(p.contributed)} note="Across your timeline" />
        <Metric label="Potential growth" value={money(p.gain)} note="Illustrative only" />
        <Metric label="Projected portfolio" value={money(p.fv)} note="Before potential taxes" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <Panel title="Build your scenario" subtitle="Changes are saved to your plan automatically">
          <ProjectionSliders scenario={scenario} setScenario={setScenario} commitScenario={commitScenario} />
          <Disclaimer>The return slider is an assumption, not a forecast. Markets can lose value, especially over shorter periods.</Disclaimer>
        </Panel>
        <Panel title="Example portfolio mix" subtitle="Educational example · not personalized advice" action={<LinkAction onClick={() => setMixOpen(true)}>Edit mix</LinkAction>}>
          <AllocationList profile={profile} />
        </Panel>
      </div>
      <div className="mt-4">
        <FinanceChat profile={profile} />
      </div>
      <OutcomeBanner
        title="What might be available for education?"
        text="In a taxable account, selling investments can trigger capital gains tax. Education use alone does not remove that tax."
        stats={[
          { label: 'Gain estimate', value: money(p.gain), note: 'above contributions' },
          { label: 'Estimated after-tax amount', value: money(p.afterTax), note: '15% gains tax assumption' },
        ]}
        cta={{ label: 'See education outcome →', to: '/plan' }}
      />
      <EditMixDialog open={mixOpen} onOpenChange={setMixOpen} profile={profile} onSave={updateProfile.mutateAsync} />
    </div>
  );
}
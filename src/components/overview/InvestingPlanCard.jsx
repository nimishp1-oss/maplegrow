import React, { useState } from 'react';
import Panel from '@/components/shared/Panel';
import LinkAction from '@/components/shared/LinkAction';
import ProjectionSliders from '@/components/shared/ProjectionSliders';
import AllocationList from '@/components/shared/AllocationList';
import EditMixDialog from '@/components/shared/EditMixDialog';
import { money } from '@/lib/finance';

export default function InvestingPlanCard({ profile, scenario, setScenario, commitScenario, updateProfile, proj }) {
  const [mixOpen, setMixOpen] = useState(false);
  return (
    <Panel className="mt-4" title="Your investing plan" subtitle="Small, consistent contributions can build options over time." action={<LinkAction to="/investments">Open investments →</LinkAction>}>
      <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-center">
        <div className="grid gap-2">
          <div className="p-4 bg-[#f5f5f7] rounded-xl">
            <small className="text-xs text-brand-muted">Estimated portfolio at graduation</small>
            <strong className="block font-heading font-extrabold text-2xl mt-1 tabular-nums">{money(proj.fv)}</strong>
          </div>
          <div className="p-4 bg-[#f5f5f7] rounded-xl">
            <small className="text-xs text-brand-muted">You'd contribute</small>
            <strong className="block font-heading font-bold text-lg mt-1 tabular-nums">{money(proj.contributed)}</strong>
          </div>
        </div>
        <ProjectionSliders scenario={scenario} setScenario={setScenario} commitScenario={commitScenario} />
        <div>
          <div className="flex justify-between text-xs text-[#6e6e73] mb-4">
            <span>Example investment mix</span>
            <LinkAction onClick={() => setMixOpen(true)}>Edit</LinkAction>
          </div>
          <AllocationList profile={profile} />
        </div>
      </div>
      <EditMixDialog open={mixOpen} onOpenChange={setMixOpen} profile={profile} onSave={updateProfile.mutateAsync} />
    </Panel>
  );
}
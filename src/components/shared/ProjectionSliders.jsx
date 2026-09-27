import React from 'react';
import SliderRow from '@/components/shared/SliderRow';
import { money } from '@/lib/finance';

export default function ProjectionSliders({ scenario, setScenario, commitScenario }) {
  const row = (key) => ({
    value: scenario[key],
    onChange: (v) => setScenario(key, v),
    onCommit: (v) => commitScenario(key, v),
  });
  const y = scenario.years_to_graduation;
  return (
    <div>
      <SliderRow label="Monthly contribution" display={money(scenario.monthly_contribution)} min={0} max={1000} step={25} {...row('monthly_contribution')} />
      <SliderRow label="Illustrative annual return" display={`${scenario.annual_return}%`} min={0} max={12} step={0.5} {...row('annual_return')} />
      <SliderRow label="Years until graduation" display={`${y} ${y === 1 ? 'year' : 'years'}`} min={1} max={10} step={1} {...row('years_to_graduation')} />
    </div>
  );
}
import React from 'react';
import { Slider } from '@/components/ui/slider';

export default function SliderRow({ label, display, value, min, max, step, onChange, onCommit }) {
  return (
    <div className="my-4">
      <div className="flex justify-between text-xs text-[#6e6e73] mb-3">
        <span>{label}</span>
        <b className="text-brand-ink tabular-nums">{display}</b>
      </div>
      <Slider
        value={[value]} min={min} max={max} step={step}
        onValueChange={([v]) => onChange(v)}
        onValueCommit={([v]) => onCommit(v)}
      />
    </div>
  );
}
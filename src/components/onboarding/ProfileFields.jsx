import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OnboardField from '@/components/onboarding/OnboardField';
import { SCHOOL_YEARS } from '@/lib/finance';

export default function ProfileFields({ form, set, email }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <OnboardField label="Name"><Input className="h-11" required value={form.full_name} onChange={(e) => set('full_name', e.target.value)} placeholder="Your name" /></OnboardField>
      <OnboardField label="Email"><Input className="h-11 bg-brand-paper" value={email} disabled /></OnboardField>
      <OnboardField label="Phone number"><Input className="h-11" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(555) 123-4567" /></OnboardField>
      <OnboardField label="Monthly income ($)"><Input className="h-11" type="number" min="0" required value={form.monthly_income} onChange={(e) => set('monthly_income', e.target.value)} /></OnboardField>
      <OnboardField label="School year">
        <Select value={form.school_year} onValueChange={(v) => set('school_year', v)}>
          <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
          <SelectContent>{SCHOOL_YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
        </Select>
      </OnboardField>
      <OnboardField label="Education debt ($)"><Input className="h-11" type="number" min="0" value={form.education_debt} onChange={(e) => set('education_debt', e.target.value)} /></OnboardField>
    </div>
  );
}
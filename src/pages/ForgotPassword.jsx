import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AuthShell from '@/components/auth/AuthShell';
import AuthField from '@/components/auth/AuthField';
import SubmitButton from '@/components/auth/SubmitButton';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.auth.resetPasswordRequest(email);
    } catch {
      // always show generic success
    }
    setSent(true);
    setLoading(false);
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
      footer={<Link to="/login" className="text-brand-green font-semibold">Back to sign in</Link>}
    >
      {sent ? (
        <div className="rounded-xl bg-brand-mint p-4 text-sm text-brand-ink">
          If an account exists for <b>{email}</b>, a reset link is on its way.
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <AuthField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
          <SubmitButton loading={loading}>Send reset link</SubmitButton>
        </form>
      )}
    </AuthShell>
  );
}
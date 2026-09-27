import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AuthShell from '@/components/auth/AuthShell';
import GoogleButton from '@/components/auth/GoogleButton';
import OrDivider from '@/components/auth/OrDivider';
import AuthField from '@/components/auth/AuthField';
import SubmitButton from '@/components/auth/SubmitButton';
import OtpForm from '@/components/auth/OtpForm';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('form');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('Use at least 8 characters for your password.');
    if (password !== confirm) return setError('Passwords do not match.');
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setStep('otp');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Could not create your account.');
    }
    setLoading(false);
  };

  if (step === 'otp') {
    return (
      <AuthShell title="Check your inbox" subtitle="One quick step to secure your account.">
        <OtpForm email={email} />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your free plan"
      subtitle="Start building your student money plan in minutes."
      footer={<>Already have an account? <Link to={`/login${window.location.search}`} className="text-brand-green font-semibold">Sign in</Link></>}
    >
      <GoogleButton label="Sign up with Google" />
      <OrDivider />
      <form onSubmit={submit} className="space-y-4">
        <AuthField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
        <AuthField label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 8 characters" required />
        <AuthField label="Confirm password" type="password" value={confirm} onChange={setConfirm} placeholder="Repeat password" required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <SubmitButton loading={loading}>Create account</SubmitButton>
      </form>
    </AuthShell>
  );
}
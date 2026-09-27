import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AuthShell from '@/components/auth/AuthShell';
import GoogleButton from '@/components/auth/GoogleButton';
import OrDivider from '@/components/auth/OrDivider';
import AuthField from '@/components/auth/AuthField';
import SubmitButton from '@/components/auth/SubmitButton';
import getReturnTo from '@/lib/returnTo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = getReturnTo();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Invalid email or password.');
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your financial journey."
      footer={<>New to Maple Grow? <Link to={`/register${window.location.search}`} className="text-brand-green font-semibold">Create an account</Link></>}
    >
      <GoogleButton />
      <OrDivider />
      <form onSubmit={submit} className="space-y-4">
        <AuthField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
        <AuthField
          label="Password" type="password" value={password} onChange={setPassword} placeholder="Your password" required
          right={<Link to="/forgot-password" className="text-xs font-semibold text-brand-green">Forgot?</Link>}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <SubmitButton loading={loading}>Sign in</SubmitButton>
      </form>
    </AuthShell>
  );
}
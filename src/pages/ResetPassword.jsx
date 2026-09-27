import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import AuthShell from '@/components/auth/AuthShell';
import AuthField from '@/components/auth/AuthField';
import SubmitButton from '@/components/auth/SubmitButton';

export default function ResetPassword() {
  const token = new URLSearchParams(window.location.search).get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('Use at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setLoading(true);
    try {
      await base44.auth.resetPassword({ resetToken: token, newPassword: password });
      window.location.href = '/login';
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'This reset link is invalid or expired.');
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Choose a new password" subtitle="Make it at least 8 characters.">
      {!token ? (
        <p className="text-sm text-red-600">This reset link is missing its token. Request a new one.</p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <AuthField label="New password" type="password" value={password} onChange={setPassword} required />
          <AuthField label="Confirm password" type="password" value={confirm} onChange={setConfirm} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <SubmitButton loading={loading}>Update password</SubmitButton>
        </form>
      )}
    </AuthShell>
  );
}
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import AuthField from '@/components/auth/AuthField';
import SubmitButton from '@/components/auth/SubmitButton';
import getReturnTo from '@/lib/returnTo';

export default function OtpForm({ email }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const verify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await base44.auth.verifyOtp({ email, otpCode: code.trim() });
      const token = res?.access_token || res?.data?.access_token;
      base44.auth.setToken(token);
      window.location.href = getReturnTo();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'That code did not work. Try again.');
      setLoading(false);
    }
  };

  const resend = async () => {
    setError('');
    try {
      await base44.auth.resendOtp(email);
      setInfo('A new code is on its way.');
    } catch (err) {
      setError(err?.message || 'Could not resend the code.');
    }
  };

  return (
    <form onSubmit={verify} className="space-y-4">
      <p className="text-sm text-brand-muted -mt-4">We sent a verification code to <b className="text-brand-ink">{email}</b>.</p>
      <AuthField label="Verification code" value={code} onChange={setCode} placeholder="123456" inputMode="numeric" required />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {info && <p className="text-sm text-brand-green">{info}</p>}
      <SubmitButton loading={loading}>Verify & continue</SubmitButton>
      <button type="button" onClick={resend} className="w-full text-sm font-semibold text-brand-green">Resend code</button>
    </form>
  );
}
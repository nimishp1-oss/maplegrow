import React from 'react';

export default function FullSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-brand-paper">
      <div className="w-8 h-8 border-4 border-brand-mint border-t-brand-green rounded-full animate-spin" />
    </div>
  );
}
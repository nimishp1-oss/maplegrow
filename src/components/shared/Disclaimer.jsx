import React from 'react';

export default function Disclaimer({ children, className = '' }) {
  return <p className={`text-[11px] leading-relaxed text-[#86868b] ${className}`}>{children}</p>;
}
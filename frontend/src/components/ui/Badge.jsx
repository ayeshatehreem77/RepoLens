import React from 'react';

const variantStyles = {
  open: 'bg-accent-amber/10 text-accent-amber border-accent-amber/30',
  closed: 'bg-red-500/10 text-red-400 border-red-500/30',
  merged: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/30',
  violet: 'bg-accent-violet/10 text-accent-violet border-accent-violet/30',
  neutral: 'bg-dark-hover text-slate-300 border-dark-border',
};

export const Badge = ({ label, variant = 'neutral', icon }) => {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium font-mono border ${variantStyles[variant] || variantStyles.neutral}`}>
      {icon && <span className="w-3 h-3">{icon}</span>}
      {label}
    </span>
  );
};
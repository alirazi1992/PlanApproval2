import React from 'react';
import { cn } from '../../lib/utils/cn';

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark';
}

export function GlassCard({
  children,
  className,
  variant = 'light'
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-[28px] backdrop-blur-2xl border shadow-[0_20px_60px_rgba(15,23,42,0.08)]',
        variant === 'light'
          ? 'bg-white/80 border-white/60 text-gray-900'
          : 'bg-slate-900/90 border-white/10 text-white',
        className
      )}
    >
      {children}
    </div>
  );
}

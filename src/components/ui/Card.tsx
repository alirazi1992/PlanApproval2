import React from 'react';
import { cn } from '../../lib/utils/cn';
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
}
export function Card({
  children,
  className,
  variant = 'default'
}: CardProps) {
  return <div className={cn('rounded-2xl', {
    'bg-white border border-gray-200 shadow-sm': variant === 'default',
    'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl': variant === 'glass'
  }, className)}>
      {children}
    </div>;
}
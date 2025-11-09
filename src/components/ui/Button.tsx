import React from 'react';
import { cn } from '../../lib/utils/cn';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return <button className={cn('inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200', 'focus:outline-none focus:ring-2 focus:ring-offset-2', 'disabled:opacity-50 disabled:cursor-not-allowed', {
    'bg-black text-white hover:bg-gray-900 focus:ring-gray-900': variant === 'primary',
    'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus:ring-gray-200': variant === 'secondary',
    'bg-transparent hover:bg-gray-100 text-gray-700': variant === 'ghost',
    'bg-white/10 backdrop-blur-xl border border-white/20 text-gray-900 hover:bg-white/20': variant === 'glass'
  }, {
    'px-3 py-1.5 text-sm': size === 'sm',
    'px-4 py-2 text-base': size === 'md',
    'px-6 py-3 text-lg': size === 'lg'
  }, className)} {...props}>
      {children}
    </button>;
}
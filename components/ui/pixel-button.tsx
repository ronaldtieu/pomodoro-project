import React from 'react';
import { cn } from '@/lib/utils';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseStyles = 'font-pixel font-bold uppercase border-2 pixel-rounded transition-all active:translate-y-0.5 active:shadow-none';

  const variants = {
    primary: 'bg-primary border-primary text-white hover:brightness-110 shadow-pixel-sm',
    secondary: 'bg-secondary border-secondary text-white hover:brightness-110 shadow-pixel-sm',
    accent: 'bg-accent border-accent text-gray-900 hover:brightness-110 shadow-pixel-sm',
    success: 'bg-success border-success text-white hover:brightness-110 shadow-pixel-sm',
    ghost: 'bg-white border-gray-900 text-gray-900 hover:bg-gray-100 shadow-pixel-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-sm',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

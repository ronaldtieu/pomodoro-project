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
  const baseStyles = 'font-bold border-2 transition-all active:translate-y-1 active:shadow-none';

  const variants = {
    primary: 'bg-primary border-primary text-white hover:bg-primary/90 shadow-pixel',
    secondary: 'bg-secondary border-secondary text-white hover:bg-secondary/90 shadow-pixel',
    accent: 'bg-accent border-accent text-gray-900 hover:bg-accent/90 shadow-pixel',
    success: 'bg-success border-success text-white hover:bg-success/90 shadow-pixel',
    ghost: 'bg-transparent border-transparent text-gray-700 hover:bg-gray-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-sm shadow-pixel-sm',
    md: 'px-6 py-2.5 text-base rounded shadow-pixel',
    lg: 'px-8 py-3 text-lg rounded shadow-pixel-lg',
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

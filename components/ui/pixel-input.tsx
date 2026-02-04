import React from 'react';
import { cn } from '@/lib/utils';

interface PixelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const PixelInput: React.FC<PixelInputProps> = ({
  className,
  ...props
}) => {
  return (
    <input
      className={cn(
        'w-full px-4 py-2.5 border-2 border-gray-900 rounded-md',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
        'bg-white text-gray-900 placeholder-gray-500',
        'shadow-pixel-sm transition-shadow',
        className
      )}
      {...props}
    />
  );
};

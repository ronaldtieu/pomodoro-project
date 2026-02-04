import React from 'react';
import { cn } from '@/lib/utils';

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
}

export const PixelCard: React.FC<PixelCardProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'bg-surface border-2 border-gray-900 rounded-lg shadow-pixel p-6',
        className
      )}
    >
      {children}
    </div>
  );
};

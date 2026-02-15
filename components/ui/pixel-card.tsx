import React from 'react';
import { cn } from '@/lib/utils';

interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const PixelCard: React.FC<PixelCardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-surface border-2 border-gray-900 pixel-rounded shadow-pixel p-4 sm:p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

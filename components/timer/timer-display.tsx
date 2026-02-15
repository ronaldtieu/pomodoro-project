'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TimerDisplayProps {
  timeRemaining: number;
  currentSession: 'work' | 'short_break' | 'long_break';
  progress: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeRemaining,
  currentSession,
  progress,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionColor = () => {
    switch (currentSession) {
      case 'work':
        return 'border-primary text-primary';
      case 'short_break':
        return 'border-secondary text-secondary';
      case 'long_break':
        return 'border-accent text-accent';
    }
  };

  const getSessionLabel = () => {
    switch (currentSession) {
      case 'work':
        return 'Focus Time';
      case 'short_break':
        return 'Short Break';
      case 'long_break':
        return 'Long Break';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-6">
      <div className="text-2xl font-bold text-gray-700">
        {getSessionLabel()}
      </div>

      <div className="relative">
        <svg className="w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 transform -rotate-90" viewBox="0 0 384 384">
          <circle
            cx="192"
            cy="192"
            r="170"
            stroke="currentColor"
            strokeWidth="14"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="192"
            cy="192"
            r="170"
            stroke="currentColor"
            strokeWidth="14"
            fill="transparent"
            strokeDasharray={`${2 * Math.PI * 170}`}
            strokeDashoffset={`${2 * Math.PI * 170 * (progress / 100)}`}
            strokeLinecap="butt"
            className={cn('transition-all duration-1000', getSessionColor())}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl sm:text-6xl md:text-8xl font-bold font-pixel-body text-gray-900">
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

const RADIUS = 170;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface TimerDisplayProps {
  timeRemaining: number;
  currentSession: 'work' | 'short_break' | 'long_break';
  progress: number;
  targetEndTime: number | null;
  sessionDuration: number;
  onTimeClick?: () => void;
  isClickable?: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeRemaining,
  currentSession,
  progress,
  targetEndTime,
  sessionDuration,
  onTimeClick,
  isClickable = false,
}) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const rafRef = useRef<number>(0);

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

  // Animate the circle at ~60fps using requestAnimationFrame when the timer is running
  const animate = useCallback(() => {
    if (!circleRef.current || !targetEndTime || sessionDuration <= 0) return;

    const now = Date.now();
    const remainingMs = Math.max(0, targetEndTime - now);
    const fraction = remainingMs / (sessionDuration * 1000);
    const offset = CIRCUMFERENCE * (1 - fraction);
    circleRef.current.setAttribute('stroke-dashoffset', String(offset));

    if (remainingMs > 0) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [targetEndTime, sessionDuration]);

  useEffect(() => {
    if (targetEndTime && sessionDuration > 0) {
      rafRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(rafRef.current);
    }
    // When idle/paused, set offset from the prop-based progress
    if (circleRef.current) {
      const offset = CIRCUMFERENCE * (progress / 100);
      circleRef.current.setAttribute('stroke-dashoffset', String(offset));
    }
  }, [targetEndTime, sessionDuration, animate, progress]);

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
            ref={circleRef}
            cx="192"
            cy="192"
            r="170"
            stroke="currentColor"
            strokeWidth="14"
            fill="transparent"
            strokeDasharray={`${CIRCUMFERENCE}`}
            strokeDashoffset={`${CIRCUMFERENCE * (progress / 100)}`}
            strokeLinecap="butt"
            className={cn(getSessionColor())}
          />
        </svg>

        <div
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center',
            isClickable && 'cursor-pointer group'
          )}
          onClick={isClickable ? onTimeClick : undefined}
        >
          <span className={cn(
            'text-4xl sm:text-6xl md:text-8xl font-bold font-pixel-body text-gray-900',
            isClickable && 'group-hover:text-primary transition-colors'
          )}>
            {formatTime(timeRemaining)}
          </span>
          {isClickable && (
            <span className="text-xs text-gray-400 mt-1 group-hover:text-primary transition-colors">
              tap to adjust
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

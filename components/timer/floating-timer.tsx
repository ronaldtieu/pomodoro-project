'use client';

import React, { useState } from 'react';
import { Play, Pause, ChevronUp, ChevronDown, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTimerStore } from '@/lib/stores/timer-store';
import { useTasks } from '@/lib/hooks/use-tasks';

export const FloatingTimer: React.FC = () => {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  const {
    isActive,
    isPaused,
    timeRemaining,
    currentSession,
    currentTaskId,
    startTimer,
    pauseTimer,
  } = useTimerStore();

  const { tasks } = useTasks();
  const currentTask = tasks.find((t) => t.id === currentTaskId);

  // Only show on sub-pages, not on the main dashboard
  if (pathname === '/dashboard') {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sessionLabel =
    currentSession === 'work'
      ? 'Focus'
      : currentSession === 'short_break'
        ? 'Short Break'
        : 'Long Break';

  const sessionColor =
    currentSession === 'work'
      ? 'bg-primary'
      : currentSession === 'short_break'
        ? 'bg-success'
        : 'bg-secondary';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-surface border-2 border-gray-900 pixel-rounded shadow-pixel p-3 min-w-[180px]">
        {/* Header row - always visible */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${sessionColor} ${isActive && !isPaused ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-bold text-gray-600 uppercase">{sessionLabel}</span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 pixel-rounded border-2 border-gray-400 text-gray-500 hover:text-gray-700 hover:border-gray-900 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>

        {/* Timer display - always visible */}
        <div className="text-center mt-2">
          <span className="text-2xl font-bold font-mono text-gray-900 tracking-wider">
            {formatTime(timeRemaining)}
          </span>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 space-y-3">
            {/* Current task */}
            {currentTask && (
              <div className="text-center">
                <span className="text-xs text-gray-500 block">Working on</span>
                <span className="text-sm font-semibold text-gray-800 truncate block">
                  {currentTask.title}
                </span>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-2">
              {!isActive || isPaused ? (
                <button
                  onClick={startTimer}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary border-2 border-primary text-white text-xs font-bold pixel-rounded shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all"
                >
                  <Play size={12} />
                  {isPaused ? 'Resume' : 'Start'}
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border-2 border-secondary text-white text-xs font-bold pixel-rounded shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all"
                >
                  <Pause size={12} />
                  Pause
                </button>
              )}

              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent border-2 border-gray-400 text-gray-600 text-xs font-bold pixel-rounded hover:bg-gray-100 hover:border-gray-900 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all"
              >
                <ArrowLeft size={12} />
                Timer
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

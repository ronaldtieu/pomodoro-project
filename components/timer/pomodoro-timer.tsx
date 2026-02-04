'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { TimerDisplay } from './timer-display';
import { BreakPrompt } from './break-prompt';
import { PixelButton } from '@/components/ui/pixel-button';
import { PixelCard } from '@/components/ui/pixel-card';
import { useTimer } from '@/lib/hooks/use-timer';
import { useTasks } from '@/lib/hooks/use-tasks';
import { SessionType } from '@/types';

export const PomodoroTimer: React.FC = () => {
  const {
    isActive,
    isPaused,
    timeRemaining,
    currentSession,
    completedSessions,
    currentTaskId,
    startSession,
    pauseTimer,
    resetTimer,
    skipBreak,
    abandonSession,
    formatTime,
    getProgressPercentage,
  } = useTimer();

  const { tasks } = useTasks();
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);
  const [nextSessionType, setNextSessionType] = useState<SessionType>('short_break');

  // Get user settings
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(4);

  useEffect(() => {
    const loadSettings = async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: settings } = await supabase
        .from('user_settings')
        .select('sessions_until_long_break')
        .single();

      if (settings) {
        setSessionsUntilLongBreak(settings.sessions_until_long_break);
      }
    };
    loadSettings();
  }, []);

  const handleSessionComplete = () => {
    if (currentSession === 'work') {
      const nextBreak: SessionType =
        (completedSessions + 1) % sessionsUntilLongBreak === 0
          ? 'long_break'
          : 'short_break';
      setNextSessionType(nextBreak);
      setShowBreakPrompt(true);
    }
  };

  useEffect(() => {
    if (timeRemaining === 0 && isActive) {
      handleSessionComplete();
    }
  }, [timeRemaining, isActive, currentSession, completedSessions]);

  const handleTakeBreak = () => {
    setShowBreakPrompt(false);
    startSession(nextSessionType, currentTaskId);
  };

  const handleSkipBreak = () => {
    setShowBreakPrompt(false);
    skipBreak();
  };

  const handleAbandonSession = () => {
    setShowBreakPrompt(false);
    abandonSession();
  };

  const handleStart = () => {
    if (!isActive && !isPaused) {
      startSession(currentSession);
    } else if (isPaused) {
      startSession(currentSession);
    }
  };

  const currentTask = tasks.find((t) => t.id === currentTaskId);

  return (
    <div className="space-y-6">
      {showBreakPrompt && (
        <BreakPrompt
          onTakeBreak={handleTakeBreak}
          onSkipBreak={handleSkipBreak}
          onAbandonSession={handleAbandonSession}
          sessionType={nextSessionType}
        />
      )}

      <PixelCard>
        <div className="space-y-6">
          <TimerDisplay
            timeRemaining={timeRemaining}
            currentSession={currentSession}
            progress={getProgressPercentage()}
          />

          {currentTask && (
            <div className="text-center">
              <div className="inline-block px-4 py-2 bg-primary/10 border-2 border-primary rounded-lg">
                <span className="text-sm text-gray-600">Working on: </span>
                <span className="font-bold text-primary">{currentTask.title}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            {!isActive || isPaused ? (
              <PixelButton
                onClick={handleStart}
                variant="primary"
                size="lg"
                className="min-w-[140px]"
              >
                <div className="flex items-center justify-center gap-2">
                  <Play size={24} />
                  {isPaused ? 'Resume' : 'Start'}
                </div>
              </PixelButton>
            ) : (
              <PixelButton
                onClick={pauseTimer}
                variant="secondary"
                size="lg"
                className="min-w-[140px]"
              >
                <div className="flex items-center justify-center gap-2">
                  <Pause size={24} />
                  Pause
                </div>
              </PixelButton>
            )}

            <PixelButton
              onClick={resetTimer}
              variant="ghost"
              size="lg"
              className="min-w-[140px]"
            >
              <div className="flex items-center justify-center gap-2">
                <RotateCcw size={24} />
                Reset
              </div>
            </PixelButton>
          </div>

          <div className="text-center text-sm text-gray-600">
            Completed sessions today: <span className="font-bold text-lg">{completedSessions}</span>
          </div>
        </div>
      </PixelCard>
    </div>
  );
};

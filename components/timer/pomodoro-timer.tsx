'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X } from 'lucide-react';
import { TimerDisplay } from './timer-display';
import { BreakPrompt } from './break-prompt';
import { PixelButton } from '@/components/ui/pixel-button';
import { PixelCard } from '@/components/ui/pixel-card';
import { useTimer } from '@/lib/hooks/use-timer';
import { useTasks } from '@/lib/hooks/use-tasks';
import { SessionType } from '@/types';
import { createClient } from '@/lib/supabase/client';

export const PomodoroTimer: React.FC = () => {
  const {
    isActive,
    isPaused,
    timeRemaining,
    currentSession,
    completedSessions,
    currentTaskId,
    targetEndTime,
    sessionDuration,
    startSession,
    pauseTimer,
    handleReset,
    skipBreak,
    abandonSession,
    formatTime,
    getProgressPercentage,
    saveCurrentTask,
  } = useTimer();

  const { tasks, refetch } = useTasks();
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);
  const [nextSessionType, setNextSessionType] = useState<'short_break' | 'long_break'>('short_break');
  const [showDurationEditor, setShowDurationEditor] = useState(false);

  // Duration editor state (in minutes)
  const [editWork, setEditWork] = useState(25);
  const [editShortBreak, setEditShortBreak] = useState(5);
  const [editLongBreak, setEditLongBreak] = useState(15);
  const [savingDurations, setSavingDurations] = useState(false);

  // Get user settings
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(4);

  // Clamp a numeric input string to a valid minute range
  const parseMinutes = (raw: string, min: number, max: number): number => {
    const stripped = raw.replace(/[^0-9]/g, '');
    if (stripped === '') return min;
    return Math.max(min, Math.min(max, Number(stripped)));
  };

  useEffect(() => {
    const loadSettings = async () => {
      const supabase = createClient();
      const { data: settings } = await supabase
        .from('user_settings')
        .select('*')
        .single();

      if (settings) {
        setSessionsUntilLongBreak(settings.sessions_until_long_break);
        setEditWork(settings.work_duration);
        setEditShortBreak(settings.short_break_duration);
        setEditLongBreak(settings.long_break_duration);
      }
    };
    loadSettings();
  }, []);

  const handleSessionComplete = () => {
    if (currentSession === 'work') {
      const nextBreak: 'short_break' | 'long_break' =
        (completedSessions + 1) % sessionsUntilLongBreak === 0
          ? 'long_break'
          : 'short_break';
      setNextSessionType(nextBreak);
      setShowBreakPrompt(true);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (timeRemaining === 0 && isActive) {
      handleSessionComplete();
    }
  }, [timeRemaining, isActive, currentSession, completedSessions]);

  const handleTakeBreak = () => {
    setShowBreakPrompt(false);
    startSession(nextSessionType, currentTaskId);
    refetch();
  };

  const handleSkipBreak = () => {
    setShowBreakPrompt(false);
    skipBreak();
    refetch();
  };

  const handleAbandonSession = () => {
    setShowBreakPrompt(false);
    abandonSession();
    refetch();
  };

  const handleStart = () => {
    if (!isActive && !isPaused) {
      startSession(currentSession);
    } else if (isPaused) {
      startSession(currentSession, currentTaskId, true);
    }
  };

  const timerIsIdle = !isActive && !isPaused;

  const handleTimeClick = () => {
    if (timerIsIdle) {
      setShowDurationEditor(true);
    }
  };

  const handleSaveDurations = async () => {
    setSavingDurations(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_settings')
          .update({
            work_duration: editWork,
            short_break_duration: editShortBreak,
            long_break_duration: editLongBreak,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        // Update the current timer display to reflect the new duration
        const { useTimerStore } = await import('@/lib/stores/timer-store');
        const durationMap: Record<string, number> = {
          work: editWork * 60,
          short_break: editShortBreak * 60,
          long_break: editLongBreak * 60,
        };
        useTimerStore.getState().setTimeRemaining(durationMap[currentSession]);
        useTimerStore.getState().setSessionDuration(durationMap[currentSession]);
      }
    } catch (error) {
      console.error('Error saving durations:', error);
    } finally {
      setSavingDurations(false);
      setShowDurationEditor(false);
    }
  };

  const currentTask = tasks.find((t) => t.id === currentTaskId);

  return (
    <div className="space-y-3 sm:space-y-6">
      {showBreakPrompt && (
        <BreakPrompt
          onTakeBreak={handleTakeBreak}
          onSkipBreak={handleSkipBreak}
          onAbandonSession={handleAbandonSession}
          sessionType={nextSessionType}
        />
      )}

      <PixelCard>
        <div className="space-y-3 sm:space-y-6">
          <TimerDisplay
            timeRemaining={timeRemaining}
            currentSession={currentSession}
            progress={getProgressPercentage()}
            targetEndTime={targetEndTime}
            sessionDuration={sessionDuration}
            onTimeClick={handleTimeClick}
            isClickable={timerIsIdle}
          />

          {/* Duration Editor Panel — numeric inputs */}
          {showDurationEditor && (
            <div className="border-2 border-gray-800 pixel-rounded p-4 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 uppercase">Adjust Durations</h3>
                <button
                  onClick={() => setShowDurationEditor(false)}
                  className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {([
                  { label: 'Focus', value: editWork, setValue: setEditWork, min: 1, max: 120 },
                  { label: 'Short Break', value: editShortBreak, setValue: setEditShortBreak, min: 1, max: 60 },
                  { label: 'Long Break', value: editLongBreak, setValue: setEditLongBreak, min: 1, max: 60 },
                ] as const).map((row) => (
                  <div key={row.label} className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-600 text-center uppercase">
                      {row.label}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={row.value}
                        onChange={(e) => {
                          const stripped = e.target.value.replace(/[^0-9]/g, '');
                          if (stripped === '') {
                            row.setValue(0 as any);
                            return;
                          }
                          const num = Math.min(row.max, Number(stripped));
                          row.setValue(num);
                        }}
                        onBlur={(e) => {
                          row.setValue(parseMinutes(e.target.value, row.min, row.max));
                        }}
                        className="w-full text-center text-2xl font-bold text-gray-900 border-2 border-gray-300 pixel-rounded py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                        min
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <PixelButton
                onClick={handleSaveDurations}
                variant="primary"
                size="sm"
                className="w-full"
                disabled={savingDurations}
              >
                {savingDurations ? 'Saving...' : 'Save'}
              </PixelButton>
            </div>
          )}

          <div className="text-center space-y-2">
            <span className="text-sm text-gray-600 block">
              Working on:
            </span>
            <button
              onClick={() => {
                const taskSection = document.getElementById('task-list-section');
                if (taskSection) {
                  taskSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-4 py-2 bg-white border-2 border-primary pixel-rounded text-sm font-bold text-primary cursor-pointer hover:bg-primary/5 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all max-w-xs"
            >
              {currentTask ? currentTask.title : 'No task selected'}
            </button>
            {currentTask && (
              <div className="text-xs text-gray-500">
                {currentTask.pomodoro_count} pomodoro{currentTask.pomodoro_count !== 1 ? 's' : ''} completed
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
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
              onClick={() => {
                setShowBreakPrompt(false);
                handleReset();
                refetch();
              }}
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

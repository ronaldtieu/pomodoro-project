import { useEffect, useRef } from 'react';
import { useTimerStore } from '@/lib/stores/timer-store';
import { createClient } from '@/lib/supabase/client';
import { queries } from '@/lib/supabase/queries';
import { SessionType } from '@/types';

export const useTimer = () => {
  const {
    isActive,
    isPaused,
    timeRemaining,
    currentSession,
    completedSessions,
    currentTaskId,
    setTimeRemaining,
    decrementTime,
    startTimer,
    pauseTimer,
    resetTimer,
    setSessionType,
    incrementCompletedSessions,
    setCurrentTaskId,
  } = useTimerStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartRef = useRef<Date | null>(null);
  const currentSessionIdRef = useRef<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isActive && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        decrementTime();
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      handleSessionComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeRemaining]);

  const handleSessionComplete = async () => {
    pauseTimer();

    const supabase = createClient();

    // Complete the current session
    if (currentSessionIdRef.current) {
      try {
        await queries.completeSession(supabase, currentSessionIdRef.current);

        // If it was a work session and had a task, increment pomodoro count
        if (currentSession === 'work' && currentTaskId) {
          const { data: task } = await supabase
            .from('tasks')
            .select('pomodoro_count')
            .eq('id', currentTaskId)
            .single();

          if (task) {
            await supabase
              .from('tasks')
              .update({ pomodoro_count: task.pomodoro_count + 1 })
              .eq('id', currentTaskId);
          }
        }
      } catch (error) {
        console.error('Error completing session:', error);
      }
    }

    // Auto-start next session if enabled
    const { data: settings } = await supabase
      .from('user_settings')
      .select('*')
      .single();

    if (currentSession === 'work' && settings?.auto_start_breaks) {
      // Determine break type
      const newSessionType: SessionType =
        (completedSessions + 1) % settings.sessions_until_long_break === 0
          ? 'long_break'
          : 'short_break';

      startSession(newSessionType, currentTaskId);
    } else if (currentSession !== 'work' && settings?.auto_start_work) {
      incrementCompletedSessions();
      startSession('work', currentTaskId);
    }
  };

  const startSession = async (sessionType: SessionType, taskId?: string | null) => {
    const supabase = createClient();

    // Get user settings to determine duration
    const { data: settings } = await supabase
      .from('user_settings')
      .select('*')
      .single();

    let duration = 25 * 60; // default 25 minutes
    if (settings) {
      switch (sessionType) {
        case 'work':
          duration = settings.work_duration * 60;
          break;
        case 'short_break':
          duration = settings.short_break_duration * 60;
          break;
        case 'long_break':
          duration = settings.long_break_duration * 60;
          break;
      }
    }

    setSessionType(sessionType);
    setTimeRemaining(duration);

    if (taskId !== undefined) {
      setCurrentTaskId(taskId);
    }

    // Create new session record
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const session = await queries.createSession(supabase, {
          user_id: user.id,
          task_id: taskId || currentTaskId,
          type: sessionType,
          duration,
          break_taken: false,
          break_skipped: false,
        });

        currentSessionIdRef.current = session.id;
        sessionStartRef.current = new Date();
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }

    startTimer();
  };

  const skipBreak = async () => {
    const supabase = createClient();

    if (currentSessionIdRef.current) {
      try {
        await queries.updateSession(supabase, currentSessionIdRef.current, {
          break_skipped: true,
          break_taken: false,
        });
      } catch (error) {
        console.error('Error skipping break:', error);
      }
    }

    incrementCompletedSessions();
    await startSession('work', currentTaskId);
  };

  const abandonSession = async () => {
    pauseTimer();
    resetTimer();

    const supabase = createClient();

    if (currentSessionIdRef.current) {
      try {
        await queries.updateSession(supabase, currentSessionIdRef.current, {
          cancelled_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error abandoning session:', error);
      }
    }

    currentSessionIdRef.current = null;
    sessionStartRef.current = null;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const supabase = createClient();

    let totalDuration = 25 * 60;
    switch (currentSession) {
      case 'work':
        totalDuration = 25 * 60;
        break;
      case 'short_break':
        totalDuration = 5 * 60;
        break;
      case 'long_break':
        totalDuration = 15 * 60;
        break;
    }

    return ((totalDuration - timeRemaining) / totalDuration) * 100;
  };

  return {
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
  };
};

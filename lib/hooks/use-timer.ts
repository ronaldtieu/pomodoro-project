import { useEffect, useRef } from 'react';
import { useTimerStore } from '@/lib/stores/timer-store';
import { createClient } from '@/lib/supabase/client';
import { queries } from '@/lib/supabase/queries';
import { SessionType } from '@/types';
import { playNotificationSound } from '@/lib/sounds';

// Standalone function for saving current task — can be imported without the hook's side effects
export const saveCurrentTask = async (taskId: string | null) => {
  try {
    const { data: { user } } = await createClient().auth.getUser();
    if (user) {
      await queries.updateCurrentTask(createClient(), user.id, taskId);
    }
  } catch (error) {
    console.error('Error saving current task:', error);
  }
};

export const useTimer = () => {
  const {
    isActive,
    isPaused,
    timeRemaining,
    currentSession,
    completedSessions,
    currentTaskId,
    targetEndTime,
    currentSessionId,
    sessionDuration,
    setTimeRemaining,
    decrementTime,
    startTimer,
    pauseTimer,
    resetTimer,
    setSessionType,
    setCompletedSessions,
    incrementCompletedSessions,
    setCurrentTaskId,
    setTargetEndTime,
    setCurrentSessionId,
    setSessionDuration,
  } = useTimerStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartRef = useRef<Date | null>(null);
  const isLoaded = useRef(false);

  // Load current task from database
  const loadCurrentTask = async () => {
    try {
      const { data: { user } } = await createClient().auth.getUser();
      if (user) {
        const settings = await queries.getUserSettings(createClient(), user.id);
        if (settings?.current_task_id) {
          setCurrentTaskId(settings.current_task_id);
        }
      }
    } catch (error) {
      console.error('Error loading current task:', error);
    }
  };

  // On mount: recalculate time if there was an active timer persisted
  useEffect(() => {
    if (isActive && !isPaused && targetEndTime) {
      const remaining = Math.max(0, Math.ceil((targetEndTime - Date.now()) / 1000));
      setTimeRemaining(remaining);
    }
  // Only run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load today's completed sessions on mount
  useEffect(() => {
    const loadTodaySessions = async () => {
      try {
        const { data: { user } } = await createClient().auth.getUser();
        if (user && !isLoaded.current) {
          const sessions = await queries.getTodayCompletedWorkSessions(createClient(), user.id);
          setCompletedSessions(sessions.length);
          isLoaded.current = true;
        }
      } catch (error) {
        console.error('Error loading today\'s sessions:', error);
      }
    };

    loadTodaySessions();
    loadCurrentTask();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isActive && !isPaused) {
      // Track the wall-clock end time so the countdown stays accurate
      // even when the browser throttles timers in background tabs
      const state = useTimerStore.getState();
      if (state.targetEndTime === null && state.timeRemaining > 0) {
        setTargetEndTime(Date.now() + state.timeRemaining * 1000);
      }

      const tick = () => {
        const endTime = useTimerStore.getState().targetEndTime;
        if (endTime === null) return;
        const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
        setTimeRemaining(remaining);

        // Handle session completion inside the tick to avoid
        // tearing down and recreating the interval every second
        if (remaining === 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          handleSessionComplete();
        }
      };

      intervalRef.current = setInterval(tick, 1000);

      // Recalculate immediately when the tab becomes visible again
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          tick();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    } else {
      setTargetEndTime(null);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isActive, isPaused]);

  const handleSessionComplete = async () => {
    pauseTimer();

    const isWorkSession = currentSession === 'work';

    // Increment completed sessions immediately for work sessions,
    // before any async DB work, so the UI updates right away
    if (isWorkSession) {
      incrementCompletedSessions();
    }

    const supabase = createClient();

    // Play notification sound if enabled
    try {
      const { data: soundSettings } = await supabase
        .from('user_settings')
        .select('sound_enabled')
        .single();
      if (soundSettings?.sound_enabled !== false) {
        playNotificationSound();
      }
    } catch {
      // Default to playing if we can't check settings
      playNotificationSound();
    }

    // Complete the current session in the database
    if (currentSessionId) {
      try {
        await queries.completeSession(supabase, currentSessionId);

        // If it was a work session and had a task, increment pomodoro count
        if (isWorkSession && currentTaskId) {
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
      setCurrentSessionId(null);
      sessionStartRef.current = null;
    }

    try {
      const { data: settings } = await supabase
        .from('user_settings')
        .select('*')
        .single();

      if (isWorkSession) {
        if (settings?.auto_start_breaks) {
          const newSessionType: SessionType =
            (completedSessions + 1) % settings.sessions_until_long_break === 0
              ? 'long_break'
              : 'short_break';
          startSession(newSessionType, currentTaskId);
        }
        // If not auto-starting, timer stays paused — component shows break prompt
      } else {
        // Break completed — transition back to work
        if (settings?.auto_start_work) {
          startSession('work', currentTaskId);
        } else {
          const workDuration = settings?.work_duration ? settings.work_duration * 60 : 25 * 60;
          setSessionType('work');
          setTimeRemaining(workDuration);
          setSessionDuration(workDuration);
        }
      }
    } catch (error) {
      console.error('Error loading settings after session complete:', error);
    }
  };

  const startSession = async (sessionType: SessionType, taskId?: string | null, resume: boolean = false) => {
    const supabase = createClient();

    // Only reset time if not resuming
    if (!resume) {
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
      setSessionDuration(duration);

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

          setCurrentSessionId(session.id);
          sessionStartRef.current = new Date();
        }
      } catch (error) {
        console.error('Error creating session:', error);
      }
    }

    startTimer();
  };

  const skipBreak = async () => {
    const supabase = createClient();

    if (currentSessionId) {
      try {
        await queries.updateSession(supabase, currentSessionId, {
          break_skipped: true,
          break_taken: false,
        });
      } catch (error) {
        console.error('Error skipping break:', error);
      }
      setCurrentSessionId(null);
      sessionStartRef.current = null;
    }

    // completedSessions already incremented when the work session ended
    await startSession('work', currentTaskId);
  };

  const handleReset = async () => {
    resetTimer();

    const supabase = createClient();

    if (currentSessionId) {
      try {
        await queries.updateSession(supabase, currentSessionId, {
          cancelled_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error cancelling session:', error);
      }
      setCurrentSessionId(null);
      sessionStartRef.current = null;
    }
  };

  const abandonSession = async () => {
    pauseTimer();
    await handleReset();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((sessionDuration - timeRemaining) / sessionDuration) * 100;
  };

  return {
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
  };
};

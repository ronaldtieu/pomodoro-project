import { useEffect, useRef } from 'react';
import { useTimerStore } from '@/lib/stores/timer-store';
import { createClient } from '@/lib/supabase/client';
import { queries } from '@/lib/supabase/queries';
import { SessionType } from '@/types';

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
    setTimeRemaining,
    decrementTime,
    startTimer,
    pauseTimer,
    resetTimer,
    setSessionType,
    setCompletedSessions,
    incrementCompletedSessions,
    setCurrentTaskId,
  } = useTimerStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartRef = useRef<Date | null>(null);
  const currentSessionIdRef = useRef<string | null>(null);
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

    const isWorkSession = currentSession === 'work';

    // Increment completed sessions immediately for work sessions,
    // before any async DB work, so the UI updates right away
    if (isWorkSession) {
      incrementCompletedSessions();
    }

    const supabase = createClient();

    // Complete the current session in the database
    if (currentSessionIdRef.current) {
      try {
        await queries.completeSession(supabase, currentSessionIdRef.current);

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
      currentSessionIdRef.current = null;
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
      currentSessionIdRef.current = null;
      sessionStartRef.current = null;
    }

    // completedSessions already incremented when the work session ended
    await startSession('work', currentTaskId);
  };

  const handleReset = async () => {
    resetTimer();

    const supabase = createClient();

    if (currentSessionIdRef.current) {
      try {
        await queries.updateSession(supabase, currentSessionIdRef.current, {
          cancelled_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error cancelling session:', error);
      }
      currentSessionIdRef.current = null;
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
    handleReset,
    skipBreak,
    abandonSession,
    formatTime,
    getProgressPercentage,
    saveCurrentTask,
  };
};

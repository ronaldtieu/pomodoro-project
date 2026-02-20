import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SessionType, TimerState } from '@/types';

interface TimerStore extends TimerState {
  targetEndTime: number | null;
  currentSessionId: string | null;
  sessionDuration: number;
  setTimeRemaining: (time: number) => void;
  decrementTime: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setSessionType: (type: SessionType) => void;
  setCompletedSessions: (count: number) => void;
  incrementCompletedSessions: () => void;
  setCurrentTaskId: (taskId: string | null) => void;
  setTargetEndTime: (time: number | null) => void;
  setCurrentSessionId: (id: string | null) => void;
  setSessionDuration: (duration: number) => void;
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set) => ({
      isActive: false,
      isPaused: false,
      timeRemaining: 25 * 60, // 25 minutes in seconds
      currentSession: 'work',
      completedSessions: 0,
      currentTaskId: null,
      targetEndTime: null,
      currentSessionId: null,
      sessionDuration: 25 * 60,

      setTimeRemaining: (time) => set({ timeRemaining: time }),

      decrementTime: () => set((state) => ({
        timeRemaining: Math.max(0, state.timeRemaining - 1),
      })),

      startTimer: () => set({ isActive: true, isPaused: false }),

      pauseTimer: () => set({ isActive: false, isPaused: true }),

      resetTimer: () => set({
        isActive: false,
        isPaused: false,
        timeRemaining: 25 * 60,
        sessionDuration: 25 * 60,
        currentSession: 'work',
        targetEndTime: null,
        currentSessionId: null,
      }),

      setSessionType: (type) => set({ currentSession: type }),

      setCompletedSessions: (count) => set({ completedSessions: count }),

      incrementCompletedSessions: () => set((state) => ({
        completedSessions: state.completedSessions + 1,
      })),

      setCurrentTaskId: (taskId) => set({ currentTaskId: taskId }),

      setTargetEndTime: (time) => set({ targetEndTime: time }),

      setCurrentSessionId: (id) => set({ currentSessionId: id }),

      setSessionDuration: (duration) => set({ sessionDuration: duration }),
    }),
    {
      name: 'pomodoro-timer',
      partialize: (state) => ({
        isActive: state.isActive,
        isPaused: state.isPaused,
        timeRemaining: state.timeRemaining,
        currentSession: state.currentSession,
        completedSessions: state.completedSessions,
        currentTaskId: state.currentTaskId,
        targetEndTime: state.targetEndTime,
        currentSessionId: state.currentSessionId,
        sessionDuration: state.sessionDuration,
      }),
    }
  )
);

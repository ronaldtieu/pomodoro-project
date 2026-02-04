import { create } from 'zustand';
import { SessionType, TimerState } from '@/types';

interface TimerStore extends TimerState {
  setTimeRemaining: (time: number) => void;
  decrementTime: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setSessionType: (type: SessionType) => void;
  setCompletedSessions: (count: number) => void;
  incrementCompletedSessions: () => void;
  setCurrentTaskId: (taskId: string | null) => void;
}

export const useTimerStore = create<TimerStore>((set) => ({
  isActive: false,
  isPaused: false,
  timeRemaining: 25 * 60, // 25 minutes in seconds
  currentSession: 'work',
  completedSessions: 0,
  currentTaskId: null,

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
    currentSession: 'work',
  }),

  setSessionType: (type) => set({ currentSession: type }),

  setCompletedSessions: (count) => set({ completedSessions: count }),

  incrementCompletedSessions: () => set((state) => ({
    completedSessions: state.completedSessions + 1,
  })),

  setCurrentTaskId: (taskId) => set({ currentTaskId: taskId }),
}));

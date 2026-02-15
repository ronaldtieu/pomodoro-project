export type SessionType = 'work' | 'short_break' | 'long_break';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  pomodoro_count: number;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryAnalytics {
  categoryId: string | null;
  categoryName: string;
  categoryColor: string;
  focusTime: number;
  sessionCount: number;
  taskCount: number;
}

export interface TodoItem {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: 'not_started' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PomodoroSession {
  id: string;
  user_id: string;
  task_id: string | null;
  type: SessionType;
  duration: number;
  break_taken: boolean;
  break_skipped: boolean;
  started_at: string;
  completed_at: string | null;
  cancelled_at: string | null;
}

export interface UserSettings {
  user_id: string;
  work_duration: number;
  short_break_duration: number;
  long_break_duration: number;
  sessions_until_long_break: number;
  auto_start_breaks: boolean;
  auto_start_work: boolean;
  sound_enabled: boolean;
  current_task_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimerState {
  isActive: boolean;
  isPaused: boolean;
  timeRemaining: number;
  currentSession: SessionType;
  completedSessions: number;
  currentTaskId: string | null;
}

export interface AnalyticsData {
  totalFocusTime: number;
  todayFocusTime: number;
  weekFocusTime: number;
  avgDailyFocusTime: number;
  breakComplianceRate: number;
  tasksCompleted: number;
  tasksAbandoned: number;
  dailyProductivity: Array<{ date: string; count: number; focusTime: number }>;
  categoryBreakdown: CategoryAnalytics[];
  weeklyCategoryBreakdown: CategoryAnalytics[];
  dailyCategoryBreakdown: CategoryAnalytics[];
}

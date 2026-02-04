import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { queries } from '@/lib/supabase/queries';
import { PomodoroSession, AnalyticsData } from '@/types';

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalFocusTime: 0,
    todayFocusTime: 0,
    weekFocusTime: 0,
    breakComplianceRate: 0,
    tasksCompleted: 0,
    tasksAbandoned: 0,
    dailyProductivity: [],
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const calculateAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get all sessions
      const allSessions = await queries.getSessions(supabase, user.id);

      // Get today's sessions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaySessions = allSessions.filter(
        (session) => new Date(session.started_at) >= today
      );

      // Get this week's sessions
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekSessions = allSessions.filter(
        (session) => new Date(session.started_at) >= weekAgo
      );

      // Calculate focus time (work sessions only, in minutes)
      const calculateFocusTime = (sessions: PomodoroSession[]) =>
        sessions
          .filter((s) => s.type === 'work' && s.completed_at)
          .reduce((total, session) => total + session.duration / 60, 0);

      const totalFocusTime = calculateFocusTime(allSessions);
      const todayFocusTime = calculateFocusTime(todaySessions);
      const weekFocusTime = calculateFocusTime(weekSessions);

      // Calculate break compliance
      const workSessions = allSessions.filter((s) => s.type === 'work' && s.completed_at);
      const breaksTaken = workSessions.filter((s) => s.break_taken).length;
      const breakComplianceRate =
        workSessions.length > 0 ? (breaksTaken / workSessions.length) * 100 : 0;

      // Get tasks
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);

      const tasksCompleted = tasks?.filter((t: any) => t.completed).length || 0;
      const tasksAbandoned = tasks?.filter((t: any) => !t.completed && t.pomodoro_count > 0).length || 0;

      // Calculate daily productivity (last 30 days)
      const dailyProductivity: Array<{ date: string; count: number; focusTime: number }> = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const daySessions = allSessions.filter((session) => {
          const sessionDate = new Date(session.started_at);
          return sessionDate >= date && sessionDate < nextDay;
        });

        const completedTasks = tasks?.filter((t: any) => {
          if (!t.completed_at) return false;
          const completedDate = new Date(t.completed_at);
          return completedDate >= date && completedDate < nextDay;
        }).length || 0;

        const dayFocusTime = calculateFocusTime(daySessions);

        dailyProductivity.push({
          date: dateStr,
          count: completedTasks,
          focusTime: dayFocusTime,
        });
      }

      setAnalytics({
        totalFocusTime,
        todayFocusTime,
        weekFocusTime,
        breakComplianceRate,
        tasksCompleted,
        tasksAbandoned,
        dailyProductivity,
      });
    } catch (error) {
      console.error('Error calculating analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    calculateAnalytics();
  }, []);

  return {
    analytics,
    loading,
    refetch: calculateAnalytics,
  };
};

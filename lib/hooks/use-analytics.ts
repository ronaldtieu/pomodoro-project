import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { queries } from '@/lib/supabase/queries';
import { PomodoroSession, AnalyticsData, CategoryAnalytics } from '@/types';

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalFocusTime: 0,
    todayFocusTime: 0,
    weekFocusTime: 0,
    avgDailyFocusTime: 0,
    breakComplianceRate: 0,
    tasksCompleted: 0,
    tasksAbandoned: 0,
    dailyProductivity: [],
    categoryBreakdown: [],
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

      // Calculate focus time (work sessions only, in minutes)
      const calculateFocusTime = (sessions: PomodoroSession[]) =>
        sessions
          .filter((s) => s.type === 'work' && s.completed_at)
          .reduce((total, session) => total + session.duration / 60, 0);

      const totalFocusTime = calculateFocusTime(allSessions);
      const todayFocusTime = calculateFocusTime(todaySessions);

      // Get this week's sessions (last 7 days)
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 6);
      const weekSessions = allSessions.filter(
        (session) => new Date(session.started_at) >= weekAgo
      );
      const weekFocusTime = calculateFocusTime(weekSessions);

      // Calculate average daily focus time (total focus / number of active days)
      const completedWorkSessionsAll = allSessions.filter((s) => s.type === 'work' && s.completed_at);
      const activeDays = new Set(
        completedWorkSessionsAll.map((s) => new Date(s.started_at).toISOString().split('T')[0])
      );
      const avgDailyFocusTime = activeDays.size > 0 ? totalFocusTime / activeDays.size : 0;

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

      // Category breakdown
      const userCategories = await queries.getCategories(supabase, user.id);
      const taskCategoryMap: Record<string, string | null> = {};
      tasks?.forEach((t: any) => { taskCategoryMap[t.id] = t.category_id || null; });

      const categoryStatsMap: Record<string, { focusTime: number; sessionCount: number; taskIds: Set<string> }> = {};

      // Initialize with "uncategorized"
      categoryStatsMap['uncategorized'] = { focusTime: 0, sessionCount: 0, taskIds: new Set() };
      userCategories.forEach((cat) => {
        categoryStatsMap[cat.id] = { focusTime: 0, sessionCount: 0, taskIds: new Set() };
      });

      // Aggregate completed work sessions by category
      const completedWorkSessions = allSessions.filter((s) => s.type === 'work' && s.completed_at);
      completedWorkSessions.forEach((session) => {
        const catId = session.task_id ? taskCategoryMap[session.task_id] : null;
        const bucket = catId && categoryStatsMap[catId] ? catId : 'uncategorized';
        categoryStatsMap[bucket].focusTime += session.duration / 60;
        categoryStatsMap[bucket].sessionCount += 1;
        if (session.task_id) {
          categoryStatsMap[bucket].taskIds.add(session.task_id);
        }
      });

      const categoryMap: Record<string, { name: string; color: string }> = {};
      userCategories.forEach((cat) => { categoryMap[cat.id] = { name: cat.name, color: cat.color }; });

      const categoryBreakdown: CategoryAnalytics[] = Object.entries(categoryStatsMap)
        .filter(([, stats]) => stats.sessionCount > 0)
        .map(([id, stats]) => ({
          categoryId: id === 'uncategorized' ? null : id,
          categoryName: id === 'uncategorized' ? 'Uncategorized' : (categoryMap[id]?.name || 'Unknown'),
          categoryColor: id === 'uncategorized' ? '#6B7280' : (categoryMap[id]?.color || '#6B7280'),
          focusTime: stats.focusTime,
          sessionCount: stats.sessionCount,
          taskCount: stats.taskIds.size,
        }));

      setAnalytics({
        totalFocusTime,
        todayFocusTime,
        weekFocusTime,
        avgDailyFocusTime,
        breakComplianceRate,
        tasksCompleted,
        tasksAbandoned,
        dailyProductivity,
        categoryBreakdown,
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

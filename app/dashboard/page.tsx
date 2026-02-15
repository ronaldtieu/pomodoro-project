'use client';

import React from 'react';
import { PomodoroTimer } from '@/components/timer/pomodoro-timer';
import { StatsCards } from '@/components/analytics/stats-cards';
import { TaskList } from '@/components/tasks/task-list';
import { useAnalytics } from '@/lib/hooks/use-analytics';

export default function DashboardPage() {
  const { analytics, loading } = useAnalytics();

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto pt-16 md:pt-6">
        {!loading && <StatsCards analytics={analytics} />}
        <PomodoroTimer />
        <TaskList />
      </main>
    </div>
  );
}

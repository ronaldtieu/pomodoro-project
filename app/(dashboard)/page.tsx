'use client';

import React from 'react';
import { PomodoroTimer } from '@/components/timer/pomodoro-timer';
import { StatsCards } from '@/components/analytics/stats-cards';
import { useAnalytics } from '@/lib/hooks/use-analytics';

export default function DashboardPage() {
  const { analytics, loading } = useAnalytics();

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PomodoroTimer />
          </div>

          <div className="space-y-6">
            {!loading && <StatsCards analytics={analytics} />}
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import React from 'react';
import { StatsCards } from '@/components/analytics/stats-cards';
import { ProductivityChart } from '@/components/analytics/productivity-chart';
import { BreakComplianceChart } from '@/components/analytics/break-compliance-chart';
import { CategoryChart } from '@/components/analytics/category-chart';
import { CalendarView } from '@/components/analytics/calendar-view';
import { Header } from '@/components/layout/header';
import { useAnalytics } from '@/lib/hooks/use-analytics';

export default function AnalyticsPage() {
  const { analytics, loading } = useAnalytics();

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-gray-600">Loading analytics...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics</h1>
        </div>

        <StatsCards analytics={analytics} />

        <div className="grid lg:grid-cols-2 gap-6">
          <ProductivityChart analytics={analytics} />
          <BreakComplianceChart analytics={analytics} />
        </div>

        <CategoryChart analytics={analytics} />

        <CalendarView analytics={analytics} />
      </main>
    </div>
  );
}

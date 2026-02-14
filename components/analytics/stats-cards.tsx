'use client';

import React from 'react';
import { Clock, Calendar, TrendingUp, BarChart3, CheckCircle } from 'lucide-react';
import { PixelCard } from '@/components/ui/pixel-card';
import { AnalyticsData } from '@/types';

interface StatsCardsProps {
  analytics: AnalyticsData;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ analytics }) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const stats = [
    {
      label: 'Today',
      value: formatTime(analytics.todayFocusTime),
      icon: Clock,
      color: 'text-primary bg-primary/10 border-primary',
      subtext: 'focus time',
      tooltip: 'Total focus time from completed work sessions today',
    },
    {
      label: 'This Week',
      value: formatTime(analytics.weekFocusTime),
      icon: Calendar,
      color: 'text-accent bg-accent/10 border-accent',
      subtext: 'focus time',
      tooltip: 'Total focus time from the last 7 days',
    },
    {
      label: 'All Time',
      value: formatTime(analytics.totalFocusTime),
      icon: TrendingUp,
      color: 'text-secondary bg-secondary/10 border-secondary',
      subtext: 'total focus',
      tooltip: 'Total focus time across all completed work sessions',
    },
    {
      label: 'Avg Daily',
      value: formatTime(analytics.avgDailyFocusTime),
      icon: BarChart3,
      color: 'text-warning bg-warning/10 border-warning',
      subtext: 'per active day',
      tooltip: 'Average focus time per day you had at least one session',
    },
    {
      label: 'Completed',
      value: analytics.tasksCompleted.toString(),
      icon: CheckCircle,
      color: 'text-success bg-success/10 border-success',
      subtext: 'tasks done',
      tooltip: 'Total number of tasks marked as completed',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <PixelCard key={stat.label} className="p-4" title={stat.tooltip}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border-2 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.subtext}</div>
            </div>
          </div>
        </PixelCard>
      ))}
    </div>
  );
};

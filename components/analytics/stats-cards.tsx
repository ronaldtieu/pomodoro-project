'use client';

import React from 'react';
import { Clock, Target, TrendingUp, CheckCircle } from 'lucide-react';
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
    },
    {
      label: 'This Week',
      value: formatTime(analytics.weekFocusTime),
      icon: TrendingUp,
      color: 'text-secondary bg-secondary/10 border-secondary',
      subtext: 'focus time',
    },
    {
      label: 'All Time',
      value: formatTime(analytics.totalFocusTime),
      icon: Target,
      color: 'text-accent bg-accent/10 border-accent',
      subtext: 'total focus',
    },
    {
      label: 'Completed',
      value: analytics.tasksCompleted.toString(),
      icon: CheckCircle,
      color: 'text-success bg-success/10 border-success',
      subtext: 'tasks done',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <PixelCard key={stat.label} className="p-4">
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

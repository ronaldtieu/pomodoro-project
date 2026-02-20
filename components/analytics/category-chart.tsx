'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PixelCard } from '@/components/ui/pixel-card';
import { AnalyticsData } from '@/types';

type TimePeriod = 'overall' | 'weekly' | 'daily';

interface CategoryChartProps {
  analytics: AnalyticsData;
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ analytics }) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [period, setPeriod] = React.useState<TimePeriod>('overall');

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const breakdownMap = {
    overall: analytics.categoryBreakdown,
    weekly: analytics.weeklyCategoryBreakdown,
    daily: analytics.dailyCategoryBreakdown,
  };

  const data = breakdownMap[period].map((cat) => ({
    name: cat.categoryName,
    value: Math.round(cat.focusTime),
    color: cat.categoryColor,
    sessions: cat.sessionCount,
    tasks: cat.taskCount,
  }));

  const totalFocusTime = data.reduce((sum, d) => sum + d.value, 0);

  const periodLabels: { key: TimePeriod; label: string }[] = [
    { key: 'overall', label: 'Overall' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'daily', label: 'Daily' },
  ];

  return (
    <PixelCard>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Focus Time by Category</h3>
        <div className="flex justify-center">
          <div className="inline-flex border-2 border-gray-800 rounded-lg overflow-hidden">
            {periodLabels.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-bold transition-colors ${
                  period === key
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No categorized sessions for this period.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center">
              <div className="h-48 sm:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={isMobile ? 60 : 80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '2px solid #1f2937',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [formatTime(value), 'Focus Time']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {formatTime(totalFocusTime)}
              </div>
              <div className="text-sm text-gray-600">Total categorized focus time</div>
            </div>
          </>
        )}
      </div>
    </PixelCard>
  );
};

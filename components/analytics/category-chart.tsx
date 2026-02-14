'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PixelCard } from '@/components/ui/pixel-card';
import { AnalyticsData } from '@/types';

interface CategoryChartProps {
  analytics: AnalyticsData;
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ analytics }) => {
  const data = analytics.categoryBreakdown.map((cat) => ({
    name: cat.categoryName,
    value: Math.round(cat.focusTime),
    color: cat.categoryColor,
    sessions: cat.sessionCount,
    tasks: cat.taskCount,
  }));

  const totalFocusTime = data.reduce((sum, d) => sum + d.value, 0);

  if (data.length === 0) {
    return (
      <PixelCard>
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Focus Time by Category</h3>
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No categorized sessions yet. Complete a pomodoro with a categorized task to see data here.</p>
          </div>
        </div>
      </PixelCard>
    );
  }

  return (
    <PixelCard>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Focus Time by Category</h3>
        <div className="flex items-center justify-center">
          <div className="h-64 w-full">
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
                  outerRadius={80}
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
                  formatter={(value: number) => [`${value} min`, 'Focus Time']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">
            {totalFocusTime} min
          </div>
          <div className="text-sm text-gray-600">Total categorized focus time</div>
        </div>
      </div>
    </PixelCard>
  );
};

'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PixelCard } from '@/components/ui/pixel-card';
import { AnalyticsData } from '@/types';

interface ProductivityChartProps {
  analytics: AnalyticsData;
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({ analytics }) => {
  // Get last 7 days of data
  const last7Days = analytics.dailyProductivity.slice(-7);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <PixelCard>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Productivity (Last 7 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#6b7280"
                tick={{ fill: '#6b7280' }}
              />
              <YAxis stroke="#6b7280" tick={{ fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #1f2937',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [value, 'Tasks']}
                labelFormatter={(label) => formatDate(label)}
              />
              <Bar dataKey="count" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PixelCard>
  );
};

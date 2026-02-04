'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PixelCard } from '@/components/ui/pixel-card';
import { AnalyticsData } from '@/types';

interface BreakComplianceChartProps {
  analytics: AnalyticsData;
}

export const BreakComplianceChart: React.FC<BreakComplianceChartProps> = ({ analytics }) => {
  const complianceRate = Math.round(analytics.breakComplianceRate);
  const breaksTaken = complianceRate;
  const breaksSkipped = 100 - complianceRate;

  const data = [
    { name: 'Breaks Taken', value: breaksTaken, color: '#4ECDC4' },
    { name: 'Breaks Skipped', value: breaksSkipped, color: '#FF6B6B' },
  ];

  return (
    <PixelCard>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Break Compliance</h3>
        <div className="flex items-center justify-center">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">
            {complianceRate}%
          </div>
          <div className="text-sm text-gray-600">Break compliance rate</div>
        </div>
      </div>
    </PixelCard>
  );
};

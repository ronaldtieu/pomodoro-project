'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PixelCard } from '@/components/ui/pixel-card';
import { AnalyticsData } from '@/types';

interface CalendarViewProps {
  analytics: AnalyticsData;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ analytics }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

    return { daysInMonth, startDayOfWeek, year, month };
  };

  const getDataForDay = (year: number, month: number, day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return analytics.dailyProductivity.find((d) => d.date === dateStr);
  };

  const getIntensityColor = (focusTime: number) => {
    if (focusTime === 0) return 'bg-gray-100';
    if (focusTime < 30) return 'bg-green-200';
    if (focusTime < 60) return 'bg-green-300';
    if (focusTime < 90) return 'bg-green-400';
    if (focusTime < 120) return 'bg-green-500';
    if (focusTime < 150) return 'bg-green-600';
    return 'bg-green-700';
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const { daysInMonth, startDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <PixelCard>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Calendar View</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={previousMonth}
              className="p-2 pixel-rounded border-2 border-gray-400 hover:bg-gray-100 hover:border-gray-900 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm sm:text-lg font-semibold text-gray-700 min-w-[140px] sm:min-w-[200px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 pixel-rounded border-2 border-gray-400 hover:bg-gray-100 hover:border-gray-900 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
          <span>Less</span>
          <div className="w-4 h-4 bg-gray-100 rounded border border-gray-300"></div>
          <div className="w-4 h-4 bg-green-200 rounded border border-gray-300"></div>
          <div className="w-4 h-4 bg-green-400 rounded border border-gray-300"></div>
          <div className="w-4 h-4 bg-green-600 rounded border border-gray-300"></div>
          <div className="w-4 h-4 bg-green-700 rounded border border-gray-300"></div>
          <span>More</span>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs sm:text-sm font-semibold text-gray-600 py-1 sm:py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the first of the month */}
            {Array.from({ length: startDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square"></div>
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayData = getDataForDay(year, month, day);
              const focusTime = dayData?.focusTime || 0;
              const tasksCompleted = dayData?.count || 0;

              const today = new Date();
              const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

              return (
                <div
                  key={day}
                  className={cn(
                    'aspect-square border border-gray-200 rounded p-1 relative group cursor-pointer hover:ring-2 hover:ring-primary transition-all',
                    getIntensityColor(focusTime),
                    isToday && 'ring-4 ring-primary ring-offset-2 shadow-lg relative z-10'
                  )}
                  title={`${focusTime}m focus time, ${tasksCompleted} tasks completed${isToday ? ' - Today!' : ''}`}
                >
                  {isToday && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  )}
                  <span className={cn(
                    'font-semibold absolute top-1 left-1',
                    isToday ? 'text-base text-primary font-bold' : 'text-xs text-gray-700'
                  )}>
                    {day}
                  </span>
                  {isToday && (
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-primary">Today</span>
                  )}
                  {focusTime > 0 && (
                    <div className="absolute bottom-0.5 right-0.5 flex gap-0.5">
                      {tasksCompleted > 0 && (
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" title={`${tasksCompleted} tasks`}></div>
                      )}
                      <div className="w-1.5 h-1.5 bg-green-700 rounded-full" title={`${Math.round(focusTime)}m focus`}></div>
                    </div>
                  )}

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded p-2 whitespace-nowrap z-10 shadow-lg">
                    <div className="font-semibold">Day {day}</div>
                    <div>{Math.round(focusTime)}m focus time</div>
                    <div>{tasksCompleted} tasks completed</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary stats for selected month */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {(() => {
                  const minutes = Math.round(
                    analytics.dailyProductivity
                      .filter((d) => d.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`))
                      .reduce((sum, d) => sum + d.focusTime, 0)
                  );
                  const hours = Math.floor(minutes / 60);
                  const mins = minutes % 60;
                  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
                })()}
              </div>
              <div className="text-xs text-gray-600">Total Focus</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {
                  analytics.dailyProductivity.filter(
                    (d) => d.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`) && d.focusTime > 0
                  ).length
                }
              </div>
              <div className="text-xs text-gray-600">Active Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {
                  analytics.dailyProductivity
                    .filter((d) => d.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`))
                    .reduce((sum, d) => sum + d.count, 0)
                }
              </div>
              <div className="text-xs text-gray-600">Tasks Done</div>
            </div>
          </div>
        </div>
      </div>
    </PixelCard>
  );
};

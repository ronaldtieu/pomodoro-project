'use client';

import React from 'react';
import { PomodoroTimer } from '@/components/timer/pomodoro-timer';
import { TaskList } from '@/components/tasks/task-list';
import { Header } from '@/components/layout/header';

export default function TimerPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <PomodoroTimer />
          <TaskList />
        </div>
      </main>
    </div>
  );
}

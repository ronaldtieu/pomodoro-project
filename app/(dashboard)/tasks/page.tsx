'use client';

import React from 'react';
import { TaskList } from '@/components/tasks/task-list';
import { Header } from '@/components/layout/header';

export default function TasksPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 p-6 overflow-y-auto">
        <TaskList />
      </main>
    </div>
  );
}

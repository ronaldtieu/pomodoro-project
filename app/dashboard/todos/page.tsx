'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { PixelCard } from '@/components/ui/pixel-card';
import { TodoList } from '@/components/todos/todo-list';

export default function TodosPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 p-6 overflow-y-auto">
        <PixelCard>
          <TodoList />
        </PixelCard>
      </main>
    </div>
  );
}

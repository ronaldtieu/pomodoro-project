'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { PixelCard } from '@/components/ui/pixel-card';
import { NotionTodoList } from '@/components/todos/notion-todo-list';

export default function TodosPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 p-6 overflow-y-auto">
        <PixelCard>
          <NotionTodoList />
        </PixelCard>
      </main>
    </div>
  );
}

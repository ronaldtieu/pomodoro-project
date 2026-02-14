'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { PixelDialog } from '@/components/ui/pixel-dialog';
import { TaskCard } from './task-card';
import { Task, Category } from '@/types';

interface TaskArchiveProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  categoryMap: Record<string, Category>;
}

export const TaskArchive: React.FC<TaskArchiveProps> = ({
  isOpen,
  onClose,
  tasks,
  onToggleComplete,
  onDelete,
  onEdit,
  categoryMap,
}) => {
  const [search, setSearch] = useState('');

  const filteredTasks = useMemo(() => {
    if (!search.trim()) return tasks;
    const query = search.toLowerCase();
    return tasks.filter((t) => t.title.toLowerCase().includes(query));
  }, [tasks, search]);

  return (
    <PixelDialog isOpen={isOpen} onClose={onClose} title="Archive" className="max-w-lg">
      <div className="space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search archived tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border-2 border-gray-400 pixel-rounded text-sm focus:outline-none focus:border-gray-900 bg-white"
          />
        </div>

        <div className="max-h-96 overflow-y-auto space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                {search.trim() ? 'No matching archived tasks' : 'No archived tasks'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={() => onToggleComplete(task.id)}
                onDelete={() => onDelete(task.id)}
                onEdit={onEdit}
                onSetActive={() => {}}
                isActive={false}
                category={task.category_id ? categoryMap[task.category_id] : null}
              />
            ))
          )}
        </div>
      </div>
    </PixelDialog>
  );
};

'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TaskCard } from './task-card';
import { TaskForm } from './task-form';
import { PixelButton } from '@/components/ui/pixel-button';
import { useTasks } from '@/lib/hooks/use-tasks';
import { useTimerStore } from '@/lib/stores/timer-store';

export const TaskList: React.FC = () => {
  const { tasks, loading, createTask, deleteTask, toggleTaskComplete } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { currentTaskId, setCurrentTaskId } = useTimerStore();

  const handleCreateTask = async (data: { title: string; description: string }) => {
    await createTask(data);
  };

  const handleSetTaskActive = (taskId: string) => {
    setCurrentTaskId(taskId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  const incompleteTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
        <PixelButton onClick={() => setIsFormOpen(true)} variant="primary">
          <div className="flex items-center gap-2">
            <Plus size={18} />
            New Task
          </div>
        </PixelButton>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Active Tasks ({incompleteTasks.length})
          </h3>
          {incompleteTasks.length === 0 ? (
            <div className="text-center py-8 bg-white border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No active tasks. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {incompleteTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={() => toggleTaskComplete(task.id)}
                  onDelete={() => deleteTask(task.id)}
                  onSetActive={() => handleSetTaskActive(task.id)}
                  isActive={currentTaskId === task.id}
                />
              ))}
            </div>
          )}
        </div>

        {completedTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Completed ({completedTasks.length})
            </h3>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={() => toggleTaskComplete(task.id)}
                  onDelete={() => deleteTask(task.id)}
                  onSetActive={() => {}}
                  isActive={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
};

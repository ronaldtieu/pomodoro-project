'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Settings, Archive, ChevronDown, ChevronRight } from 'lucide-react';
import { TaskCard } from './task-card';
import { TaskForm } from './task-form';
import { TaskArchive } from './task-archive';
import { PixelButton } from '@/components/ui/pixel-button';
import { CategoryManager } from '@/components/categories/category-manager';
import { useTasks } from '@/lib/hooks/use-tasks';
import { useCategories } from '@/lib/hooks/use-categories';
import { useTimerStore } from '@/lib/stores/timer-store';
import { saveCurrentTask } from '@/lib/hooks/use-timer';
import { Category, Task } from '@/types';

export const TaskList: React.FC = () => {
  const { tasks, loading, createTask, updateTask, deleteTask, toggleTaskComplete } = useTasks();
  const { categories, loading: categoriesLoading, createCategory, updateCategory, deleteCategory } = useCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);
  const { currentTaskId, setCurrentTaskId } = useTimerStore();

  const categoryMap = useMemo(() => {
    const map: Record<string, Category> = {};
    categories.forEach((c) => { map[c.id] = c; });
    return map;
  }, [categories]);

  const handleCreateTask = async (data: { title: string; description: string; category_id: string | null }) => {
    await createTask(data);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: { title: string; description: string; category_id: string | null }) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleSetTaskActive = async (taskId: string) => {
    setCurrentTaskId(taskId);
    await saveCurrentTask(taskId);
  };

  if (loading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  const filteredTasks = selectedCategoryFilter
    ? tasks.filter((t) => t.category_id === selectedCategoryFilter)
    : tasks;

  const incompleteTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentCompleted = completedTasks.filter(
    (t) => t.completed_at && new Date(t.completed_at).getTime() >= sevenDaysAgo
  );
  const archivedCompleted = completedTasks.filter(
    (t) => !t.completed_at || new Date(t.completed_at).getTime() < sevenDaysAgo
  );

  return (
    <div id="task-list-section" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
        <div className="flex items-center gap-2">
          <PixelButton onClick={() => setShowCategoryManager(!showCategoryManager)} variant="ghost" size="sm">
            <Settings size={18} />
          </PixelButton>
          <PixelButton onClick={() => { setEditingTask(null); setIsFormOpen(true); }} variant="primary">
            <div className="flex items-center gap-2">
              <Plus size={18} />
              New Task
            </div>
          </PixelButton>
        </div>
      </div>

      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onCreateCategory={createCategory}
          onUpdateCategory={updateCategory}
          onDeleteCategory={deleteCategory}
        />
      )}

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategoryFilter(null)}
            className={`px-3 py-1.5 pixel-rounded text-sm font-medium border-2 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all ${
              selectedCategoryFilter === null
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-400 bg-white text-gray-700 hover:border-gray-900'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(
                selectedCategoryFilter === cat.id ? null : cat.id
              )}
              className={`px-3 py-1.5 pixel-rounded text-sm font-medium border-2 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 ${
                selectedCategoryFilter === cat.id
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-400 bg-white text-gray-700 hover:border-gray-900'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              {cat.name}
            </button>
          ))}
        </div>
      )}

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
                  onEdit={handleEditTask}
                  onSetActive={() => handleSetTaskActive(task.id)}
                  isActive={currentTaskId === task.id}
                  category={task.category_id ? categoryMap[task.category_id] : null}
                />
              ))}
            </div>
          )}
        </div>

        {recentCompleted.length > 0 && (
          <div>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-1.5 text-lg font-semibold text-gray-700 mb-3 hover:text-gray-900 transition-colors"
            >
              {showCompleted ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              Completed ({recentCompleted.length})
            </button>
            {showCompleted && (
              <div className="space-y-3">
                {recentCompleted.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={() => toggleTaskComplete(task.id)}
                    onDelete={() => deleteTask(task.id)}
                    onEdit={handleEditTask}
                    onSetActive={() => {}}
                    isActive={false}
                    category={task.category_id ? categoryMap[task.category_id] : null}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          <PixelButton
            variant="ghost"
            size="sm"
            onClick={() => setShowArchive(true)}
          >
            <div className="flex items-center gap-2">
              <Archive size={16} />
              Archive ({archivedCompleted.length})
            </div>
          </PixelButton>
        </div>
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        categories={categories}
        onCreateCategory={createCategory}
        mode={editingTask ? 'edit' : 'create'}
        initialTask={editingTask}
      />

      <TaskArchive
        isOpen={showArchive}
        onClose={() => setShowArchive(false)}
        tasks={archivedCompleted}
        onToggleComplete={(id) => toggleTaskComplete(id)}
        onDelete={(id) => deleteTask(id)}
        onEdit={handleEditTask}
        categoryMap={categoryMap}
      />
    </div>
  );
};

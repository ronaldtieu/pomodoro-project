'use client';

import React from 'react';
import { Check, Trash2, Clock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PixelButton } from '@/components/ui/pixel-button';
import { Task as TaskType } from '@/types';

interface TaskCardProps {
  task: TaskType;
  onToggleComplete: () => void;
  onDelete: () => void;
  onSetActive: () => void;
  isActive?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onSetActive,
  isActive,
}) => {
  return (
    <div
      className={cn(
        'bg-surface border-2 rounded-lg p-4 transition-all',
        task.completed ? 'border-gray-300 opacity-60' : 'border-gray-900 shadow-pixel-sm',
        isActive && 'border-primary ring-2 ring-primary'
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggleComplete}
          className={cn(
            'flex-shrink-0 w-6 h-6 border-2 rounded flex items-center justify-center transition-colors',
            task.completed
              ? 'bg-success border-success text-white'
              : 'border-gray-400 hover:border-success'
          )}
        >
          {task.completed && <Check size={14} />}
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              'font-semibold text-gray-900',
              task.completed && 'line-through text-gray-500'
            )}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{task.pomodoro_count} pomodoros</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!task.completed && !isActive && (
            <PixelButton
              onClick={onSetActive}
              variant="accent"
              size="sm"
              title="Set as active task"
            >
              <Play size={14} />
            </PixelButton>
          )}
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

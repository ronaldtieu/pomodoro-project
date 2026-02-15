'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Check, MoreHorizontal, Pencil, Trash2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task as TaskType, Category } from '@/types';

interface TaskCardProps {
  task: TaskType;
  onToggleComplete: () => void;
  onDelete: () => void;
  onEdit: (task: TaskType) => void;
  onSetActive: () => void;
  isActive?: boolean;
  category?: Category | null;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  onSetActive,
  isActive,
  category,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
        setShowDeleteConfirm(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <div
      onClick={onSetActive}
      className={cn(
        'bg-surface pixel-border pixel-rounded p-4 transition-all cursor-pointer',
        task.completed
          ? 'border-success/50 opacity-70'
          : 'border-gray-900 shadow-pixel-sm hover:shadow-pixel',
        isActive && '!border-primary animate-pulse-glow'
      )}
    >
      <div className="flex items-start gap-3">
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

          {category && (
            <span
              className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color,
                border: `1px solid ${category.color}40`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </span>
          )}

          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{task.pomodoro_count} pomodoros</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isActive && (
            <span className="px-2.5 py-1 bg-primary/10 border border-primary/30 text-primary text-xs font-bold rounded-full">
              Selected
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
            className={cn(
              'flex-shrink-0 w-10 h-10 border-2 pixel-rounded flex items-center justify-center shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all',
              task.completed
                ? 'bg-success border-success/80'
                : 'border-gray-400 bg-white hover:border-success hover:bg-success/10'
            )}
            title={task.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {task.completed && <Check size={16} className="text-white" strokeWidth={3} />}
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
                setShowDeleteConfirm(false);
              }}
              className="p-2 pixel-rounded border-2 border-gray-400 text-gray-400 hover:text-gray-700 hover:border-gray-600 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all"
            >
              <MoreHorizontal size={16} />
            </button>

            {showMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1 w-44 bg-white border-2 border-gray-900 pixel-rounded shadow-pixel z-50"
              >
                {!showDeleteConfirm ? (
                  <>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onEdit(task);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </>
                ) : (
                  <div className="p-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Are you sure?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setShowDeleteConfirm(false);
                          onDelete();
                        }}
                        className="flex-1 px-2 py-1.5 text-xs font-medium bg-red-500 text-white pixel-rounded border-2 border-red-700 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all"
                      >
                        Yes, delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 px-2 py-1.5 text-xs font-medium bg-white text-gray-700 pixel-rounded border-2 border-gray-400 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

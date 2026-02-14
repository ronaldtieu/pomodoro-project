'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { TodoItem } from '@/types';
import { format } from 'date-fns';

interface PickerOption {
  value: string;
  label: string;
}

interface IOSPickerProps {
  options: PickerOption[];
  value: string;
  onChange: (value: any) => void;
}

const IOSPicker: React.FC<IOSPickerProps> = ({ options, value, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const itemHeight = 44;
  const visibleItems = 3;
  const containerHeight = itemHeight * visibleItems;

  const currentIndex = options.findIndex(opt => opt.value === value);

  useEffect(() => {
    if (containerRef.current && !isDragging) {
      const targetScrollTop = currentIndex * itemHeight;
      containerRef.current.scrollTop = targetScrollTop;
    }
  }, [currentIndex, itemHeight, isDragging]);

  const handleScroll = () => {
    if (!containerRef.current || isDragging) return;

    const index = Math.round(containerRef.current.scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, options.length - 1));
    onChange(options[clampedIndex].value);
  };

  const handleStart = (clientY: number) => {
    setIsDragging(true);
    setStartY(clientY);
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };

  const handleMove = (clientY: number) => {
    if (!isDragging || !containerRef.current) return;

    const deltaY = startY - clientY;
    containerRef.current.scrollTop = scrollTop + deltaY;
  };

  const handleEnd = () => {
    if (!containerRef.current) return;

    setIsDragging(false);
    const index = Math.round(containerRef.current.scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, options.length - 1));

    // Snap to selection
    containerRef.current.scrollTo({
      top: clampedIndex * itemHeight,
      behavior: 'smooth'
    });

    onChange(options[clampedIndex].value);
  };

  return (
    <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50" style={{ height: containerHeight }}>
      {/* Selection highlight */}
      <div
        className="absolute left-0 right-0 bg-primary/10 border-y-2 border-primary pointer-events-none z-10"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          height: itemHeight
        }}
      />

      {/* Scrollable content */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto scrollbar-hide"
        onScroll={handleScroll}
        style={{ paddingTop: itemHeight, paddingBottom: itemHeight }}
        onMouseDown={(e) => handleStart(e.clientY)}
        onMouseMove={(e) => handleMove(e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientY)}
        onTouchEnd={handleEnd}
      >
        {options.map((option, index) => (
          <div
            key={option.value}
            onClick={() => {
              onChange(option.value);
              if (containerRef.current) {
                containerRef.current.scrollTo({
                  top: index * itemHeight,
                  behavior: 'smooth'
                });
              }
            }}
            className="flex items-center justify-center text-center font-pixel text-sm font-semibold cursor-pointer select-none hover:bg-gray-100 active:bg-gray-200 transition-colors"
            style={{ height: itemHeight }}
          >
            {option.label}
          </div>
        ))}
      </div>

      {/* Fade overlays */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
    </div>
  );
};

interface TodoModalProps {
  todo: TodoItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<TodoItem>) => Promise<void>;
  onCreate: (data: Partial<TodoItem>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isCreating: boolean;
}

export const TodoModal: React.FC<TodoModalProps> = ({ todo, isOpen, onClose, onSave, onCreate, onDelete, isCreating }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'not_started' | 'in_progress' | 'done'>('not_started');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (todo && !isCreating) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      setStatus(todo.status);
      setPriority(todo.priority);
      setDueDate(todo.due_date ? todo.due_date.split('T')[0] : '');
    } else {
      // Reset for new todo
      setTitle('');
      setDescription('');
      setStatus('not_started');
      setPriority('medium');
      setDueDate('');
    }
  }, [todo, isCreating, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!title.trim()) return;

    setIsSaving(true);
    try {
      if (isCreating || !todo) {
        await onCreate({
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          due_date: dueDate || null,
        });
      } else {
        await onSave(todo.id, {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          due_date: dueDate || null,
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving todo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!todo) return;
    if (confirm('Are you sure you want to delete this todo?')) {
      await onDelete(todo.id);
      onClose();
    }
  };

  const statusColors = {
    not_started: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    in_progress: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    done: 'bg-green-100 text-green-700 hover:bg-green-200',
  };

  const statusLabels = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    done: 'Done',
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    medium: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    high: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    urgent: 'bg-red-100 text-red-700 hover:bg-red-200',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-gray-900 pixel-rounded shadow-pixel-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b-2 border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Todo title..."
                className="w-full text-xl font-bold font-pixel text-gray-900 border-0 p-0 focus:outline-none focus:ring-0 placeholder-gray-400"
              />
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                {!isCreating && todo ? (
                  <>
                    <Calendar size={14} />
                    Created {format(new Date(todo.created_at), 'MMM d, yyyy')}
                  </>
                ) : (
                  <span className="text-gray-400">New todo</span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 pixel-rounded border-2 border-gray-400 text-gray-600 hover:text-gray-900 hover:border-gray-900 hover:bg-gray-100 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Status Picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Status
              </label>
              <IOSPicker
                options={[
                  { value: 'not_started', label: 'Not Started' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'done', label: 'Done' },
                ]}
                value={status}
                onChange={setStatus}
              />
            </div>

            {/* Priority Picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Priority
              </label>
              <IOSPicker
                options={[
                  { value: 'low', label: 'LOW' },
                  { value: 'medium', label: 'MEDIUM' },
                  { value: 'high', label: 'HIGH' },
                  { value: 'urgent', label: 'URGENT' },
                ]}
                value={priority}
                onChange={setPriority}
              />
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 border-gray-200 flex items-center justify-between">
          {!isCreating && todo && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-red-600 border-2 border-gray-400 pixel-rounded hover:bg-red-50 hover:border-red-300 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all font-pixel text-sm"
            >
              <AlertCircle size={16} />
              Delete
            </button>
          )}
          <div className="flex gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 pixel-rounded border-2 border-gray-400 hover:bg-gray-300 hover:border-gray-900 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all font-pixel text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || isSaving}
              className="px-6 py-2 bg-primary text-white pixel-rounded border-2 border-primary hover:brightness-110 shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed font-pixel text-sm"
            >
              {isSaving ? 'Saving...' : isCreating ? 'Create Todo' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

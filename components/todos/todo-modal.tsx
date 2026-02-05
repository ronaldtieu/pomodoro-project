'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, AlertCircle } from 'lucide-react';
import { TodoItem } from '@/types';
import { format } from 'date-fns';

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(todo.id, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        due_date: dueDate || null,
      });
      onClose();
    } catch (error) {
      console.error('Error saving todo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
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
      <div className="bg-white border-2 border-gray-900 rounded-lg shadow-pixel-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
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
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
          <div className="grid grid-cols-1 gap-6">
            {/* Status Slider */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Status
              </label>
              <div className="relative">
                {/* Digital Display */}
                <div className="text-center mb-3">
                  <div className={`inline-block px-4 py-2 rounded-lg font-pixel text-sm font-bold border-2 ${
                    status === 'not_started' ? 'bg-gray-100 border-gray-300 text-gray-700' :
                    status === 'in_progress' ? 'bg-blue-100 border-blue-300 text-blue-700' :
                    'bg-green-100 border-green-300 text-green-700'
                  }`}>
                    {statusLabels[status]}
                  </div>
                </div>

                {/* Slider Track */}
                <div className="relative h-2 bg-gray-200 rounded-full">
                  {/* Progress Fill */}
                  <div
                    className={`absolute h-full rounded-full transition-all duration-300 ${
                      status === 'not_started' ? 'w-0 bg-gray-400' :
                      status === 'in_progress' ? 'w-1/2 bg-blue-500' :
                      'w-full bg-green-500'
                    }`}
                  />

                  {/* Slider Points */}
                  <div className="absolute inset-0 flex justify-between">
                    {(['not_started', 'in_progress', 'done'] as const).map((s, idx) => {
                      const isSelected = status === s;
                      const position = idx === 0 ? '0%' : idx === 1 ? '50%' : '100%';
                      return (
                        <button
                          key={s}
                          onClick={() => setStatus(s)}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                            isSelected
                              ? (s === 'not_started' ? 'bg-gray-500 border-gray-700 scale-110 shadow-lg' :
                                 s === 'in_progress' ? 'bg-blue-500 border-blue-700 scale-110 shadow-lg' :
                                 'bg-green-500 border-green-700 scale-110 shadow-lg')
                              : 'bg-white border-gray-300 hover:scale-125'
                          }`}
                          style={{ left: position }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Labels */}
                <div className="flex justify-between mt-2 text-xs font-semibold text-gray-600 font-pixel">
                  <span>Not Started</span>
                  <span>In Progress</span>
                  <span>Done</span>
                </div>
              </div>
            </div>

            {/* Priority Slider */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Priority
              </label>
              <div className="relative">
                {/* Digital Display */}
                <div className="text-center mb-3">
                  <div className={`inline-block px-4 py-2 rounded-lg font-pixel text-sm font-bold border-2 capitalize ${
                    priority === 'low' ? 'bg-gray-100 border-gray-300 text-gray-600' :
                    priority === 'medium' ? 'bg-yellow-100 border-yellow-300 text-yellow-700' :
                    priority === 'high' ? 'bg-orange-100 border-orange-300 text-orange-700' :
                    'bg-red-100 border-red-300 text-red-700'
                  }`}>
                    {priority.toUpperCase()}
                  </div>
                </div>

                {/* Slider Track */}
                <div className="relative h-2 bg-gray-200 rounded-full">
                  {/* Progress Fill */}
                  <div
                    className={`absolute h-full rounded-full transition-all duration-300 ${
                      priority === 'low' ? 'w-0 bg-gray-400' :
                      priority === 'medium' ? 'w-1/3 bg-yellow-500' :
                      priority === 'high' ? 'w-2/3 bg-orange-500' :
                      'w-full bg-red-500'
                    }`}
                  />

                  {/* Slider Points */}
                  <div className="absolute inset-0 flex justify-between">
                    {(['low', 'medium', 'high', 'urgent'] as const).map((p, idx) => {
                      const isSelected = priority === p;
                      const position = idx === 0 ? '0%' : idx === 1 ? '33.33%' : idx === 2 ? '66.67%' : '100%';
                      return (
                        <button
                          key={p}
                          onClick={() => setPriority(p)}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                            isSelected
                              ? (p === 'low' ? 'bg-gray-500 border-gray-700 scale-110 shadow-lg' :
                                 p === 'medium' ? 'bg-yellow-500 border-yellow-700 scale-110 shadow-lg' :
                                 p === 'high' ? 'bg-orange-500 border-orange-700 scale-110 shadow-lg' :
                                 'bg-red-500 border-red-700 scale-110 shadow-lg')
                              : 'bg-white border-gray-300 hover:scale-125'
                          }`}
                          style={{ left: position }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Labels */}
                <div className="flex justify-between mt-2 text-xs font-semibold text-gray-600 font-pixel">
                  <span>LOW</span>
                  <span>MED</span>
                  <span>HIGH</span>
                  <span>URGENT</span>
                </div>
              </div>
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
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-pixel text-sm"
            >
              <AlertCircle size={16} />
              Delete
            </button>
          )}
          <div className="flex gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-pixel text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || isSaving}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-pixel text-sm"
            >
              {isSaving ? 'Saving...' : isCreating ? 'Create Todo' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

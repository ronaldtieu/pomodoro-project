'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { TodoItem } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { PixelButton } from '@/components/ui/pixel-button';
import { TodoModal } from './todo-modal';

type SortField = 'default' | 'status' | 'priority' | 'due_date';

const STATUS_ORDER: Record<string, number> = { in_progress: 0, not_started: 1, done: 2 };
const PRIORITY_ORDER: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [sortField, setSortField] = useState<SortField>('default');
  const supabase = createClient();

  const handleSort = (field: SortField) => {
    setSortField(prev => prev === field ? 'default' : field);
  };

  const sortedTodos = useMemo(() => {
    if (sortField === 'default') return todos;
    const sorted = [...todos];
    switch (sortField) {
      case 'status':
        sorted.sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9));
        break;
      case 'priority':
        sorted.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9));
        break;
      case 'due_date':
        sorted.sort((a, b) => {
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        });
        break;
    }
    return sorted;
  }, [todos, sortField]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (todoData: Partial<TodoItem>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('todos')
        .insert([{
          user_id: user.id,
          title: todoData.title?.trim() || '',
          description: todoData.description || null,
          status: todoData.status || 'not_started',
          priority: todoData.priority || 'medium',
          due_date: todoData.due_date || null,
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTodos([data, ...todos]);
        setIsCreating(false);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  };

  const updateTodo = async (id: string, updates: Partial<TodoItem>) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .update({ ...updates, completed_at: updates.status === 'done' ? new Date().toISOString() : null })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTodos(todos.map(todo => todo.id === id ? data : todo));
        setSelectedTodo(null);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTodos(todos.filter(todo => todo.id !== id));
      setSelectedTodo(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  };

  const handleRowClick = (todo: TodoItem) => {
    setSelectedTodo(todo);
    setShowModal(true);
    setIsCreating(false);
  };

  const handleNewClick = () => {
    setSelectedTodo(null);
    setShowModal(true);
    setIsCreating(true);
  };

  const statusColors = {
    not_started: 'text-gray-600 bg-gray-100',
    in_progress: 'text-blue-600 bg-blue-100',
    done: 'text-green-600 bg-green-100',
  };

  const statusLabels = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    done: 'Done',
  };

  const priorityColors = {
    low: 'text-gray-500',
    medium: 'text-yellow-600',
    high: 'text-orange-600',
    urgent: 'text-red-600',
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return <ChevronUp size={12} className="inline ml-0.5" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">All Todos</h2>
          <PixelButton onClick={handleNewClick} variant="primary">
            <div className="flex items-center gap-2">
              <Plus size={16} />
              New
            </div>
          </PixelButton>
        </div>

        {/* Mobile sort controls */}
        <div className="flex md:hidden items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 uppercase">Sort by:</span>
          {([
            { field: 'status' as SortField, label: 'Status' },
            { field: 'priority' as SortField, label: 'Priority' },
            { field: 'due_date' as SortField, label: 'Due Date' },
          ]).map(({ field, label }) => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={cn(
                'px-2.5 py-1 text-xs font-bold border-2 pixel-rounded transition-all active:translate-y-0.5',
                sortField === field
                  ? 'bg-gray-800 border-gray-800 text-white'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-gray-800'
              )}
            >
              {label}
              {sortField === field && <ChevronUp size={10} className="inline ml-0.5" />}
            </button>
          ))}
        </div>

        {/* Table Header - desktop only, clickable columns */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 border-b-2 border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wide">
          <div className="col-span-5">Title</div>
          <div
            className={cn(
              "col-span-2 cursor-pointer select-none hover:text-gray-900 transition-colors",
              sortField === 'status' && "text-gray-900"
            )}
            onClick={() => handleSort('status')}
          >
            Status<SortIcon field="status" />
          </div>
          <div
            className={cn(
              "col-span-2 cursor-pointer select-none hover:text-gray-900 transition-colors",
              sortField === 'priority' && "text-gray-900"
            )}
            onClick={() => handleSort('priority')}
          >
            Priority<SortIcon field="priority" />
          </div>
          <div
            className={cn(
              "col-span-3 cursor-pointer select-none hover:text-gray-900 transition-colors",
              sortField === 'due_date' && "text-gray-900"
            )}
            onClick={() => handleSort('due_date')}
          >
            Due Date<SortIcon field="due_date" />
          </div>
        </div>

        {/* Todo Items */}
        <div className="space-y-2 md:space-y-1">
          {sortedTodos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No todos yet</p>
              <p className="text-sm">Click &quot;New&quot; to create your first todo</p>
            </div>
          ) : (
            sortedTodos.map((todo) => (
              <div
                key={todo.id}
                onClick={() => handleRowClick(todo)}
                className="px-4 py-3 border border-gray-200 rounded hover:bg-gray-50 hover:ring-2 hover:ring-primary transition-all cursor-pointer group"
              >
                {/* Mobile: stacked card layout */}
                <div className="md:hidden space-y-2">
                  <div
                    className={cn(
                      "font-medium",
                      todo.status === 'done' && 'line-through text-gray-400'
                    )}
                  >
                    {todo.title}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold",
                      statusColors[todo.status]
                    )}>
                      {statusLabels[todo.status]}
                    </div>
                    <div className={cn(
                      "text-sm font-semibold capitalize",
                      priorityColors[todo.priority]
                    )}>
                      {todo.priority}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar size={14} />
                      {todo.due_date ? format(new Date(todo.due_date), 'MMM d, yyyy') : '-'}
                    </div>
                  </div>
                </div>

                {/* Desktop: grid row layout */}
                <div className="hidden md:grid grid-cols-12 gap-4">
                  <div className="col-span-5 flex items-center min-w-0">
                    <div
                      className={cn(
                        "truncate font-medium",
                        todo.status === 'done' && 'line-through text-gray-400'
                      )}
                    >
                      {todo.title}
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold",
                      statusColors[todo.status]
                    )}>
                      {statusLabels[todo.status]}
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <div className={cn(
                      "text-sm font-semibold capitalize",
                      priorityColors[todo.priority]
                    )}>
                      {todo.priority}
                    </div>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar size={14} />
                      {todo.due_date ? format(new Date(todo.due_date), 'MMM d, yyyy') : '-'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      <TodoModal
        todo={selectedTodo}
        isOpen={showModal}
        isCreating={isCreating}
        onClose={() => {
          setShowModal(false);
          setSelectedTodo(null);
          setIsCreating(false);
        }}
        onSave={updateTodo}
        onCreate={createTodo}
        onDelete={deleteTodo}
      />
    </>
  );
};

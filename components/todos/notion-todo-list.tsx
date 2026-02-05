'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { TodoItem } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TodoModal } from './todo-modal';

export const NotionTodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const supabase = createClient();

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
          <button
            onClick={handleNewClick}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all font-pixel text-sm"
          >
            <Plus size={16} />
            New
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b-2 border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wide">
          <div className="col-span-5">Title</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-3">Due Date</div>
        </div>

        {/* Todo Items */}
        <div className="space-y-1">
          {todos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No todos yet</p>
              <p className="text-sm">Click &quot;New&quot; to create your first todo</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                onClick={() => handleRowClick(todo)}
                className="grid grid-cols-12 gap-4 px-4 py-3 border border-gray-200 rounded hover:bg-gray-50 hover:ring-2 hover:ring-primary transition-all cursor-pointer group"
              >
                {/* Title */}
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

                {/* Status */}
                <div className="col-span-2 flex items-center">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    statusColors[todo.status]
                  )}>
                    {statusLabels[todo.status]}
                  </div>
                </div>

                {/* Priority */}
                <div className="col-span-2 flex items-center">
                  <div className={cn(
                    "text-sm font-semibold capitalize",
                    priorityColors[todo.priority]
                  )}>
                    {todo.priority}
                  </div>
                </div>

                {/* Due Date */}
                <div className="col-span-3 flex items-center">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar size={14} />
                    {todo.due_date ? format(new Date(todo.due_date), 'MMM d, yyyy') : '-'}
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

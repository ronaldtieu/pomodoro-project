'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Tag, MoreHorizontal } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { TodoItem } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const NotionTodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editField, setEditField] = useState<string>('');
  const [newValue, setNewValue] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
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

  const createTodo = async () => {
    if (!newTodoTitle.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('todos')
        .insert([{
          user_id: user.id,
          title: newTodoTitle.trim(),
          status: 'not_started',
          priority: 'medium',
        }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTodos([data, ...todos]);
        setNewTodoTitle('');
        setShowNewForm(false);
      }
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const updateTodo = async (id: string, field: string, value: any) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .update({ [field]: value, completed_at: field === 'status' && value === 'done' ? new Date().toISOString() : null })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTodos(todos.map(todo => todo.id === id ? data : todo));
      }
    } catch (error) {
      console.error('Error updating todo:', error);
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
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const startEdit = (id: string, field: string, value: any) => {
    setEditingId(id);
    setEditField(field);
    setNewValue(String(value));
  };

  const saveEdit = () => {
    if (editingId && editField) {
      updateTodo(editingId, editField, newValue);
      setEditingId(null);
      setEditField('');
      setNewValue('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditField('');
    setNewValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">All Todos</h2>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all font-pixel text-sm"
        >
          <Plus size={16} />
          New
        </button>
      </div>

      {/* New Todo Form */}
      {showNewForm && (
        <div className="border-2 border-primary rounded-lg p-4 bg-gray-50">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                createTodo();
              } else if (e.key === 'Escape') {
                setShowNewForm(false);
                setNewTodoTitle('');
              }
            }}
            placeholder="Todo title..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={createTodo}
              className="px-4 py-2 bg-primary text-white rounded hover:brightness-110 text-sm font-pixel"
            >
              Add Todo
            </button>
            <button
              onClick={() => {
                setShowNewForm(false);
                setNewTodoTitle('');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-pixel"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b-2 border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wide">
        <div className="col-span-4">Title</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Priority</div>
        <div className="col-span-2">Due Date</div>
        <div className="col-span-2">Actions</div>
      </div>

      {/* Todo Items */}
      <div className="space-y-1">
        {todos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No todos yet</p>
            <p className="text-sm">Click "New" to create your first todo</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="grid grid-cols-12 gap-4 px-4 py-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors group"
            >
              {/* Title */}
              <div className="col-span-4 flex items-center min-w-0">
                {editingId === todo.id && editField === 'title' ? (
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={saveEdit}
                    className="w-full px-2 py-1 border border-primary rounded focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <div
                    onClick={() => startEdit(todo.id, 'title', todo.title)}
                    className={cn(
                      "truncate cursor-text hover:bg-gray-100 px-2 py-1 rounded -mx-2",
                      todo.status === 'done' && 'line-through text-gray-400'
                    )}
                  >
                    {todo.title}
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="col-span-2 flex items-center">
                {editingId === todo.id && editField === 'status' ? (
                  <select
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onBlur={saveEdit}
                    className="w-full px-2 py-1 border border-primary rounded text-sm"
                    autoFocus
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                ) : (
                  <div
                    onClick={() => startEdit(todo.id, 'status', todo.status)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity",
                      statusColors[todo.status]
                    )}
                  >
                    {statusLabels[todo.status]}
                  </div>
                )}
              </div>

              {/* Priority */}
              <div className="col-span-2 flex items-center">
                {editingId === todo.id && editField === 'priority' ? (
                  <select
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onBlur={saveEdit}
                    className="w-full px-2 py-1 border border-primary rounded text-sm"
                    autoFocus
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                ) : (
                  <div
                    onClick={() => startEdit(todo.id, 'priority', todo.priority)}
                    className={cn(
                      "text-sm font-semibold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded capitalize",
                      priorityColors[todo.priority]
                    )}
                  >
                    {todo.priority}
                  </div>
                )}
              </div>

              {/* Due Date */}
              <div className="col-span-2 flex items-center">
                {editingId === todo.id && editField === 'due_date' ? (
                  <input
                    type="date"
                    value={newValue ? new Date(newValue).toISOString().split('T')[0] : ''}
                    onChange={(e) => setNewValue(e.target.value)}
                    onBlur={saveEdit}
                    className="w-full px-2 py-1 border border-primary rounded text-sm"
                    autoFocus
                  />
                ) : (
                  <div
                    onClick={() => startEdit(todo.id, 'due_date', todo.due_date)}
                    className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                  >
                    <Calendar size={14} />
                    {todo.due_date ? format(new Date(todo.due_date), 'MMM d') : '-'}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-2 flex items-center">
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

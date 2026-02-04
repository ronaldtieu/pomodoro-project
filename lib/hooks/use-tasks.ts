import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { queries } from '@/lib/supabase/queries';
import { Task } from '@/types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchTasks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userTasks = await queries.getTasks(supabase, user.id);
        setTasks(userTasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const newTask = await queries.createTask(supabase, {
          ...taskData,
          user_id: user.id,
        });
        setTasks([newTask, ...tasks]);
        return newTask;
      }
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await queries.updateTask(supabase, id, updates);
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await queries.deleteTask(supabase, id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      await updateTask(id, {
        completed: !task.completed,
        completed_at: !task.completed ? new Date().toISOString() : null,
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    refetch: fetchTasks,
  };
};

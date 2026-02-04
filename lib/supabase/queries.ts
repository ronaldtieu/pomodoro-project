import { Database } from '@/types/supabase';
import { Task, PomodoroSession, UserSettings } from '@/types';

export const queries = {
  // Tasks
  getTasks: async (supabase: any, userId: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Task[];
  },

  createTask: async (supabase: any, task: Partial<Task>) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  updateTask: async (supabase: any, id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  deleteTask: async (supabase: any, id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) throw error;
  },

  // Pomodoro Sessions
  createSession: async (supabase: any, session: Partial<PomodoroSession>) => {
    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .insert(session)
      .select()
      .single();

    if (error) throw error;
    return data as PomodoroSession;
  },

  completeSession: async (supabase: any, id: string) => {
    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as PomodoroSession;
  },

  updateSession: async (supabase: any, id: string, updates: Partial<PomodoroSession>) => {
    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as PomodoroSession;
  },

  getSessions: async (supabase: any, userId: string, startDate?: Date, endDate?: Date) => {
    let query = supabase
      .from('pomodoro_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    if (startDate) {
      query = query.gte('started_at', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('started_at', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as PomodoroSession[];
  },

  // User Settings
  getUserSettings: async (supabase: any, userId: string) => {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If settings don't exist, create default settings
      if (error.code === 'PGRST116') {
        return queries.createUserSettings(supabase, userId);
      }
      throw error;
    }

    return data as UserSettings;
  },

  createUserSettings: async (supabase: any, userId: string) => {
    const defaultSettings: Partial<UserSettings> = {
      user_id: userId,
      work_duration: 25,
      short_break_duration: 5,
      long_break_duration: 15,
      sessions_until_long_break: 4,
      auto_start_breaks: false,
      auto_start_work: false,
      sound_enabled: true,
    };

    const { data, error } = await supabase
      .from('user_settings')
      .insert(defaultSettings)
      .select()
      .single();

    if (error) throw error;
    return data as UserSettings;
  },

  updateUserSettings: async (supabase: any, userId: string, settings: Partial<UserSettings>) => {
    const { data, error } = await supabase
      .from('user_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as UserSettings;
  },
};

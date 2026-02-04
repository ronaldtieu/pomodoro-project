-- Add estimated_pomodoros column to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS estimated_pomodoros INTEGER DEFAULT NULL;

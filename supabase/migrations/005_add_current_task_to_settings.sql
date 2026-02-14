-- Add current_task_id column to user_settings for tracking active task
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS current_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_user_settings_current_task ON user_settings(current_task_id);

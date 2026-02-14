-- Seed data for user: imronn26@gmail.com (09543578-2b6b-4b46-bfc9-a489a5004b10)
-- This seeds data for January 2026

-- Disable RLS for seeding
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE pomodoro_sessions DISABLE ROW LEVEL SECURITY;

-- Insert Tasks
INSERT INTO tasks (id, user_id, title, description, estimated_pomodoros, completed, pomodoro_count, created_at, updated_at, completed_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'Build Pomodoro App', 'Create a full-stack pomodoro timer with Next.js and Supabase', 20, false, 0, NOW(), NOW(), NULL),
  ('550e8400-e29b-41d4-a716-446655440002', '09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'Study React Hooks', 'Learn advanced hooks patterns and best practices', 8, false, 0, NOW(), NOW(), NULL),
  ('550e8400-e29b-41d4-a716-446655440003', '09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'Code Review', 'Review pull requests from the team', 4, true, 2, '2026-01-20 10:00:00', '2026-01-20 10:00:00', '2026-01-25 18:00:00'),
  ('550e8400-e29b-41d4-a716-446655440004', '09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'Documentation', 'Write API documentation for the project', 6, false, 0, NOW(), NOW(), NULL),
  ('550e8400-e29b-41d4-a716-446655440005', '09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'Team Meeting', 'Weekly sync with the development team', 2, true, 1, '2026-01-27 09:00:00', '2026-01-27 09:00:00', '2026-01-28 10:00:00')
ON CONFLICT (id) DO NOTHING;

-- Insert Pomodoro Sessions for January 2026
-- Creating realistic patterns: weekdays are more productive (8-10 sessions), weekends lighter (1-3 sessions)

-- January 1, 2026 (Wednesday) - High productivity
INSERT INTO pomodoro_sessions (user_id, type, duration, break_taken, break_skipped, started_at, completed_at)
VALUES
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-01 09:00:00', '2026-01-01 09:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-01 09:25:00', '2026-01-01 09:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-01 09:30:00', '2026-01-01 09:55:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-01 09:55:00', '2026-01-01 10:00:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-01 10:00:00', '2026-01-01 10:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-01 10:25:00', '2026-01-01 10:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-01 10:30:00', '2026-01-01 10:55:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-01 10:55:00', '2026-01-01 11:00:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-01 11:00:00', '2026-01-01 11:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'long_break', 900, true, false, '2026-01-01 11:25:00', '2026-01-01 11:40:00');

-- January 2, 2026 (Thursday) - High productivity
INSERT INTO pomodoro_sessions (user_id, type, duration, break_taken, break_skipped, started_at, completed_at)
VALUES
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-02 09:00:00', '2026-01-02 09:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-02 09:25:00', '2026-01-02 09:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-02 09:30:00', '2026-01-02 09:55:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-02 09:55:00', '2026-01-02 10:00:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-02 10:00:00', '2026-01-02 10:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-02 10:25:00', '2026-01-02 10:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-02 10:30:00', '2026-01-02 10:55:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-02 10:55:00', '2026-01-02 11:00:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-02 11:00:00', '2026-01-02 11:25:00');

-- January 3, 2026 (Friday) - Medium-high productivity (6 sessions before weekend)
INSERT INTO pomodoro_sessions (user_id, type, duration, break_taken, break_skipped, started_at, completed_at)
VALUES
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-03 09:00:00', '2026-01-03 09:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-03 09:25:00', '2026-01-03 09:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-03 09:30:00', '2026-01-03 09:55:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-03 09:55:00', '2026-01-03 10:00:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-03 10:00:00', '2026-01-03 10:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-03 10:25:00', '2026-01-03 10:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-03 10:30:00', '2026-01-03 10:55:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'long_break', 900, true, false, '2026-01-03 10:55:00', '2026-01-03 11:10:00');

-- January 4, 2026 (Saturday) - Light activity
INSERT INTO pomodoro_sessions (user_id, type, duration, break_taken, break_skipped, started_at, completed_at)
VALUES
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, false, false, '2026-01-04 11:00:00', '2026-01-04 11:25:00');

-- January 5, 2026 (Sunday) - Very light
INSERT INTO pomodoro_sessions (user_id, type, duration, break_taken, break_skipped, started_at, completed_at)
VALUES
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-05 14:00:00', '2026-01-05 14:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-05 14:25:00', '2026-01-05 14:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-05 14:30:00', '2026-01-05 14:55:00');

-- January 6, 2026 (Monday) - Back to work, high productivity (9 sessions)
INSERT INTO pomodoro_sessions (user_id, type, duration, break_taken, break_skipped, started_at, completed_at)
VALUES
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-06 08:00:00', '2026-01-06 08:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-06 08:25:00', '2026-01-06 08:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-06 08:30:00', '2026-01-06 08:55:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-06 08:55:00', '2026-01-06 09:00:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-06 09:00:00', '2026-01-06 09:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-06 09:25:00', '2026-01-06 09:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-06 09:30:00', '2026-01-06 09:55:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-06 09:55:00', '2026-01-06 10:00:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-06 10:00:00', '2026-01-06 10:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-06 10:25:00', '2026-01-06 10:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-06 10:30:00', '2026-01-06 10:55:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-06 10:55:00', '2026-01-06 11:00:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-06 11:00:00', '2026-01-06 11:25:00');

-- Sample more days with varying patterns
-- January 10 (Friday) - Good day
INSERT INTO pomodoro_sessions (user_id, type, duration, break_taken, break_skipped, started_at, completed_at)
VALUES
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-10 09:00:00', '2026-01-10 09:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-10 09:25:00', '2026-01-10 09:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-10 09:30:00', '2026-01-10 09:55:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-10 09:55:00', '2026-01-10 10:00:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-10 10:00:00', '2026-01-10 10:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-10 10:25:00', '2026-01-10 10:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-10 10:30:00', '2026-01-10 10:55:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'long_break', 900, true, false, '2026-01-10 10:55:00', '2026-01-10 11:10:00');

-- January 15 (Wednesday) - Great day!
INSERT INTO pomodoro_sessions (user_id, type, duration, break_taken, break_skipped, started_at, completed_at)
VALUES
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-15 09:00:00', '2026-01-15 09:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-15 09:25:00', '2026-01-15 09:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-15 09:30:00', '2026-01-15 09:55:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-15 09:55:00', '2026-01-15 10:00:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-15 10:00:00', '2026-01-15 10:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-15 10:25:00', '2026-01-15 10:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-15 10:30:00', '2026-01-15 10:55:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-15 10:55:00', '2026-01-15 11:00:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-15 11:00:00', '2026-01-15 11:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-15 11:25:00', '2026-01-15 11:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-15 11:30:00', '2026-01-15 11:55:00');

-- January 20 (Monday) - Productive
INSERT INTO pomodoro_sessions (user_id, type, duration, break_taken, break_skipped, started_at, completed_at)
VALUES
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-20 09:00:00', '2026-01-20 09:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-20 09:25:00', '2026-01-20 09:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-20 09:30:00', '2026-01-20 09:55:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-20 09:55:00', '2026-01-20 10:00:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-20 10:00:00', '2026-01-20 10:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-20 10:25:00', '2026-01-20 10:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-20 10:30:00', '2026-01-20 10:55:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-20 10:55:00', '2026-01-20 11:00:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-20 11:00:00', '2026-01-20 11:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-20 11:25:00', '2026-01-20 11:30:00');

-- January 25 (Saturday) - Some weekend work
INSERT INTO pomodoro_sessions (user_id, type, duration, break_taken, break_skipped, started_at, completed_at)
VALUES
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, false, false, '2026-01-25 13:00:00', '2026-01-25 13:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, false, false, '2026-01-25 14:00:00', '2026-01-25 14:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, false, false, '2026-01-25 15:00:00', '2026-01-25 15:25:00');

-- January 28 (Tuesday) - Very productive!
INSERT INTO pomodoro_sessions (user_id, type, duration, break_taken, break_skipped, started_at, completed_at)
VALUES
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-28 08:30:00', '2026-01-28 08:55:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-28 08:55:00', '2026-01-28 09:00:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-28 09:00:00', '2026-01-28 09:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-28 09:25:00', '2026-01-28 09:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-28 09:30:00', '2026-01-28 09:55:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-28 09:55:00', '2026-01-28 10:00:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-28 10:00:00', '2026-01-28 10:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-28 10:25:00', '2026-01-28 10:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-28 10:30:00', '2026-01-28 10:55:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-28 10:55:00', '2026-01-28 11:00:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-28 11:00:00', '2026-01-28 11:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'long_break', 900, true, false, '2026-01-28 11:25:00', '2026-01-28 11:40:00');

-- January 31 (Saturday) - Light end of month
INSERT INTO pomodoro_sessions (user_id, type, duration, break_taken, break_skipped, started_at, completed_at)
VALUES
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-31 10:00:00', '2026-01-31 10:25:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'short_break', 300, true, false, '2026-01-31 10:25:00', '2026-01-31 10:30:00'),
  ('09543578-2b6b-4b46-bfc9-a489a5004b10'::uuid, 'work', 1500, true, false, '2026-01-31 10:30:00', '2026-01-31 10:55:00');

-- Re-enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;

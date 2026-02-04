const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const USER_ID = '09543578-2b6b-4b46-bfc9-a489a5004b10';

// Helper to create a date at midnight
const getDate = (year, month, day) => {
  const date = new Date(year, month, day, 0, 0, 0);
  return date.toISOString();
};

const seedData = async () => {
  console.log('🌱 Seeding data for user:', USER_ID);

  try {
    // First, create some tasks
    console.log('📝 Creating tasks...');

    const tasks = [
      {
        user_id: USER_ID,
        title: 'Build Pomodoro App',
        description: 'Create a full-stack pomodoro timer with Next.js and Supabase',
        estimated_pomodoros: 20,
        completed: false,
      },
      {
        user_id: USER_ID,
        title: 'Study React Hooks',
        description: 'Learn advanced hooks patterns and best practices',
        estimated_pomodoros: 8,
        completed: false,
      },
      {
        user_id: USER_ID,
        title: 'Code Review',
        description: 'Review pull requests from the team',
        estimated_pomodoros: 4,
        completed: true,
        completed_at: getDate(2026, 0, 25),
      },
      {
        user_id: USER_ID,
        title: 'Documentation',
        description: 'Write API documentation for the project',
        estimated_pomodoros: 6,
        completed: false,
      },
      {
        user_id: USER_ID,
        title: 'Team Meeting',
        description: 'Weekly sync with the development team',
        estimated_pomodoros: 2,
        completed: true,
        completed_at: getDate(2026, 0, 28),
      },
    ];

    const createdTasks = [];
    for (const task of tasks) {
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
      } else {
        console.log('✅ Created task:', data.title);
        createdTasks.push(data);
      }
    }

    // Create pomodoro sessions for every day in January 2026
    console.log('⏰ Creating pomodoro sessions for January 2026...');

    const sessions = [];

    // Different patterns for different days of the week
    for (let day = 1; day <= 31; day++) {
      const date = new Date(2026, 0, day); // January 2026
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

      // Skip weekends (less productive)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Light activity on weekends
        const numSessions = Math.floor(Math.random() * 3) + 1; // 1-3 sessions
        for (let i = 0; i < numSessions; i++) {
          const startedAt = new Date(2026, 0, day, 10 + i * 2, 0, 0); // Starting from 10 AM

          sessions.push({
            user_id: USER_ID,
            type: 'work',
            duration: 25 * 60, // 25 minutes in seconds
            break_taken: Math.random() > 0.3,
            break_skipped: Math.random() > 0.7,
            started_at: startedAt.toISOString(),
            completed_at: new Date(startedAt.getTime() + 25 * 60 * 1000).toISOString(),
          });
        }
      } else {
        // Weekdays - more productive
        // Varied patterns based on day of week
        const baseSessions = dayOfWeek === 5 ? 6 : 8; // Friday: 6, others: 8
        const variance = Math.floor(Math.random() * 4) - 2; // -2 to +2
        const numWorkSessions = Math.max(4, baseSessions + variance);

        let currentTime = new Date(2026, 0, day, 9, 0, 0); // 9 AM start

        for (let i = 0; i < numWorkSessions; i++) {
          const taskIndex = Math.floor(Math.random() * createdTasks.length);
          const taskId = createdTasks[taskIndex]?.id || null;

          sessions.push({
            user_id: USER_ID,
            task_id: taskId,
            type: 'work',
            duration: 25 * 60,
            break_taken: Math.random() > 0.2, // 80% take breaks
            break_skipped: false,
            started_at: currentTime.toISOString(),
            completed_at: new Date(currentTime.getTime() + 25 * 60 * 1000).toISOString(),
          });

          currentTime = new Date(currentTime.getTime() + 25 * 60 * 1000); // Add work session time

          // Add break (if taken)
          if (Math.random() > 0.2) {
            const breakType = (i + 1) % 4 === 0 ? 'long_break' : 'short_break';
            const breakDuration = breakType === 'long_break' ? 15 * 60 : 5 * 60;

            sessions.push({
              user_id: USER_ID,
              type: breakType,
              duration: breakDuration,
              break_taken: true,
              break_skipped: false,
              started_at: currentTime.toISOString(),
              completed_at: new Date(currentTime.getTime() + breakDuration * 1000).toISOString(),
            });

            currentTime = new Date(currentTime.getTime() + breakDuration * 1000);
          }
        }
      }
    }

    // Insert sessions in batches
    const batchSize = 100;
    for (let i = 0; i < sessions.length; i += batchSize) {
      const batch = sessions.slice(i, i + batchSize);
      const { error } = await supabase.from('pomodoro_sessions').insert(batch);

      if (error) {
        console.error('Error inserting sessions batch:', error);
      } else {
        console.log(`✅ Inserted sessions ${i + 1}-${Math.min(i + batchSize, sessions.length)}`);
      }
    }

    // Update task pomodoro counts
    console.log('🔄 Updating task pomodoro counts...');

    const { data: taskStats } = await supabase
      .from('pomodoro_sessions')
      .select('task_id')
      .not('task_id', 'is', null);

    if (taskStats) {
      const taskCounts = {};
      taskStats.forEach((session) => {
        taskCounts[session.task_id] = (taskCounts[session.task_id] || 0) + 1;
      });

      for (const [taskId, count] of Object.entries(taskCounts)) {
        await supabase
          .from('tasks')
          .update({ pomodoro_count: count })
          .eq('id', taskId);
      }
    }

    console.log('🎉 Seeding complete!');
    console.log(`✅ Created ${createdTasks.length} tasks`);
    console.log(`✅ Created ${sessions.length} pomodoro sessions`);
    console.log(`✅ Sessions span from January 1 to January 31, 2026`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
};

seedData();

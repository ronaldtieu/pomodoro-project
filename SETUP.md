# Pomodoro Task Tracker - Setup Guide

## Project Overview

A pixel-cute styled Pomodoro timer and task management application built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project's SQL Editor
3. Run the migration file: `supabase/migrations/001_initial_schema.sql`

This will create:
- `tasks` table for managing tasks
- `pomodoro_sessions` table for tracking work/break sessions
- `user_settings` table for user preferences
- Row Level Security policies to protect user data

### 3. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.local.example .env.local
```

2. Fill in your Supabase credentials (get these from Supabase Dashboard > Settings > API):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Tasks Table
- `id` - UUID primary key
- `user_id` - Foreign key to auth.users
- `title` - Task title
- `description` - Optional task description
- `completed` - Boolean completion status
- `pomodoro_count` - Number of pomodoros completed
- `created_at`, `updated_at`, `completed_at` - Timestamps

### Pomodoro Sessions Table
- `id` - UUID primary key
- `user_id` - Foreign key to auth.users
- `task_id` - Optional foreign key to tasks
- `type` - 'work', 'short_break', or 'long_break'
- `duration` - Session duration in seconds
- `break_taken` - Whether break was taken
- `break_skipped` - Whether break was skipped
- `started_at`, `completed_at`, `cancelled_at` - Timestamps

### User Settings Table
- `user_id` - UUID primary key (foreign key to auth.users)
- `work_duration` - Work session duration in minutes (default: 25)
- `short_break_duration` - Short break in minutes (default: 5)
- `long_break_duration` - Long break in minutes (default: 15)
- `sessions_until_long_break` - Number of work sessions before long break (default: 4)
- `auto_start_breaks` - Auto-start breaks after work sessions
- `auto_start_work` - Auto-start work after breaks
- `sound_enabled` - Enable sound notifications

## Features

### 1. Authentication
- User registration and login via Supabase Auth
- Protected routes requiring authentication
- Automatic session management

### 2. Pomodoro Timer
- Customizable work/break durations
- Visual countdown with circular progress
- Pause/resume/reset functionality
- Automatic break prompts
- Session tracking in database

### 3. Task Management
- Create, edit, delete tasks
- Mark tasks as complete/incomplete
- Attach tasks to active timer session
- Track pomodoro count per task
- Visual task cards with pixel-cute design

### 4. Analytics Dashboard
- Total focus time (today, week, all-time)
- Break compliance rate
- Tasks completed vs abandoned
- Daily productivity charts (last 7 days)
- Break compliance pie chart

### 5. Pixel-Cute Design
- Chunky 2-3px borders
- Pixel-style shadows (hard shadows, no blur)
- Bold, chunky typography
- Subtle grid backgrounds
- Playful hover states

## Project Structure

```
pomodoro-project/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   ├── signup/
│   │   └── layout.tsx
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── page.tsx         # Overview dashboard
│   │   ├── tasks/
│   │   ├── timer/
│   │   ├── analytics/
│   │   └── layout.tsx
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Pixel-cute UI components
│   ├── timer/               # Timer components
│   ├── tasks/               # Task components
│   ├── analytics/           # Analytics components
│   └── layout/              # Layout components
├── lib/
│   ├── supabase/            # Supabase client & queries
│   ├── hooks/               # Custom React hooks
│   ├── stores/              # Zustand state stores
│   └── utils.ts             # Utility functions
├── types/
│   └── index.ts             # TypeScript type definitions
├── styles/
│   └── globals.css          # Global styles
└── supabase/
    └── migrations/          # Database migrations
```

## Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Build Errors
- If you see "Cannot find module '@/types/supabase'", ignore it - we don't use Supabase types
- ESLint warnings about missing dependencies are intentional - we use eslint-disable comments

### Authentication Issues
- Ensure your Supabase project URL and anon key are correct in `.env.local`
- Check that Row Level Security policies are enabled in Supabase
- Verify auth.users table exists in your Supabase project

### Database Issues
- Run the migration file in Supabase SQL Editor
- Check that all tables and RLS policies are created
- Verify your user has access to the tables

## Development Tips

1. **Hot Reload**: The development server supports hot module replacement
2. **Database**: Use Supabase Dashboard to view data in real-time
3. **Auth**: Check browser console for auth errors
4. **Styling**: All custom styles are in `tailwind.config.ts`
5. **State**: Timer state is managed with Zustand in `lib/stores/timer-store.ts`

## License

MIT

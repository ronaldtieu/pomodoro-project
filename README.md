# Pomodoro Task Tracker

A pixel-cute styled Pomodoro timer and task management application built with Next.js 14, TypeScript, and Supabase.

## Features

- **Pomodoro Timer** with customizable work/break durations
- **Task Management** with pomodoro tracking per task
- **Analytics Dashboard** showing productivity trends and break compliance
- **Break Tracking** to monitor your rest habits
- **Responsive Design** that works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 14 with App Router + TypeScript
- **Auth & Database**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS with custom pixel-art inspired design
- **State Management**: Zustand for client state
- **Icons**: Lucide React
- **Charts**: Recharts for analytics

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor in your Supabase dashboard
   - Run the migration from `supabase/migrations/001_initial_schema.sql`

4. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses three main tables:

- **tasks**: Stores user tasks with pomodoro counts
- **pomodoro_sessions**: Tracks all work/break sessions
- **user_settings**: Stores user preferences for timer durations

## Usage

1. **Sign up** for a new account
2. **Create tasks** you want to work on
3. **Start the timer** on the dashboard or timer page
4. **Take breaks** when prompted to maintain productivity
5. **View analytics** to track your progress

## Customization

Timer durations can be adjusted in user settings:
- Work duration (default: 25 minutes)
- Short break (default: 5 minutes)
- Long break (default: 15 minutes)
- Sessions until long break (default: 4)

## License

MIT

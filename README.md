# Pomodoro Tracker

This is my personal Pomodoro timer and task management webapp. This is to help me track the productive time that I spend on a daily, weekly, overall basis. It also tracks the average across all active days as well.

I wanted a simple way to see:
- where my time actually goes 
- how much deep work I'm doing each day, 
- whether I'm taking breaks, and where my time goes into (category-wise)


This app gives me that visibility with daily stats, category breakdowns, and a calendar view of my productivity over time. 

I hope this project can be as useful to you, as it is to me! Thanks for checking it out.

## Features

### Pomodoro Timer
- Configurable work/break durations (defaults: 25 min work, 5 min short break, 15 min long break)
- Long break scheduling after N consecutive sessions (default: 4)
- Auto-start options for work and break sessions
- Floating timer widget visible across all dashboard pages
- Sound notifications on session completion
- Pause, resume, and abandon sessions

### Task Management
- Create tasks and link them to active Pomodoro sessions
- Track estimated vs actual pomodoros per task
- Organize tasks with color-coded categories
- Recently completed tasks shown inline (last 7 days), older completions moved to a searchable archive
- Filter task list by category

### Todos
- Separate checklist for general to-dos (independent from Pomodoro tasks)
- Status tracking: Not Started, In Progress, Done
- Priority levels: Low, Medium, High, Urgent
- Due dates with calendar picker

### Analytics
- Focus time totals (today, this week, all-time)
- Average daily focus time
- Break compliance rate
- Tasks completed vs abandoned
- 7-day productivity trend chart
- Focus time breakdown by category (pie chart)
- Calendar heatmap of daily productivity

### Categories
- Custom categories with user-defined names and colors (12 color presets)
- Default categories seeded on first login (Work, Study, Personal, Health)
- Per-category analytics: focus time, session count, task count

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript |
| Database & Auth | Supabase (PostgreSQL + Row-Level Security) |
| Styling | Tailwind CSS with custom pixel-art theme |
| State Management | Zustand |
| Charts | Recharts |
| Icons | Lucide React |
| Dates | date-fns |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)

### Setup

1. Clone this repo

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Run the database migrations in order in the Supabase SQL Editor:
   ```
   supabase/migrations/001_initial_schema.sql
   supabase/migrations/002_add_estimated_pomodoros.sql
   supabase/migrations/004_create_todos.sql
   supabase/migrations/005_add_current_task_to_settings.sql
   supabase/migrations/006_add_categories.sql
   ```

5. Start the dev server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/                    Next.js pages (auth, dashboard, analytics, todos)
components/
  ui/                   Base components (button, card, dialog, input)
  timer/                Pomodoro timer, floating widget, break prompts
  tasks/                Task list, cards, form, archive modal
  todos/                Todo list and editing modal
  analytics/            Stats cards, charts, calendar view
  categories/           Category manager
  layout/               Sidebar, header
lib/
  hooks/                Custom hooks (timer, tasks, analytics, categories)
  stores/               Zustand stores
  supabase/             Client, server helpers, queries
types/                  TypeScript type definitions
styles/                 Global CSS and pixel theme
supabase/migrations/    SQL migration files
```

## Database

Five tables, all protected with Row-Level Security:

- **tasks** — Pomodoro tasks with title, description, completion status, pomodoro count, and category
- **pomodoro_sessions** — Work and break session records with duration, type, and timestamps
- **user_settings** — Timer durations, auto-start preferences, sound toggle, active task
- **todos** — Independent checklist items with status, priority, due dates, and tags
- **categories** — User-defined categories with name and color

## License

MIT

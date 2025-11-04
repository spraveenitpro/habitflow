# Habitflow

Habitflow is a calming habit tracker built with Next.js and Supabase. It focuses on the core flow of creating habits, tracking daily progress, and reflecting through streaks and completion insights.

## Prerequisites

- Node.js 18+
- Supabase project (free tier works great)

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   # or npm install / yarn install
   ```

2. Create a `.env.local` file with your Supabase credentials:

   ```bash
   SUPABASE_URL=your-project-url
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. Initialise the Supabase schema:

   ```sql
   create table if not exists habits (
     id uuid primary key default gen_random_uuid(),
     user_id text not null,
     title text not null,
     category text,
     frequency text not null default 'daily',
     emoji text,
     created_at timestamptz not null default now()
   );

   create table if not exists habit_completions (
     id uuid primary key default gen_random_uuid(),
     habit_id uuid references habits(id) on delete cascade,
     user_id text not null,
     completed_on date not null,
     created_at timestamptz not null default now(),
     unique (habit_id, user_id, completed_on)
   );
   ```

4. Run the development server:

   ```bash
   pnpm dev
   # or npm run dev / yarn dev
   ```

5. Open `http://localhost:3000`. A unique anonymous user id is generated per browser via a cookie so each session has isolated data.

## Testing the Flow

1. Create a habit (title, optional emoji/category, frequency).
2. Mark it complete for the day; streaks and metrics update automatically.
3. Use the filter chips to view by category and the inline edit/delete actions to manage habits.

## Project Structure

- `app/dashboard/page.tsx` — server-rendered dashboard that pulls habit data/stats.
- `app/actions.ts` — server actions for CRUD + completion toggles.
- `components/` — UI components (forms, summaries, calendar, list).
- `lib/` — Supabase client and streak calculation helpers.

## Notes

- Service role key enables secure server-side deletions and streak resets; if you prefer to avoid it, you can remove the `true` flag in the server actions and rely on row-level security policies instead.
- The mini calendar shows the last 28 days of activity aggregated across habits to give a quick consistency snapshot.

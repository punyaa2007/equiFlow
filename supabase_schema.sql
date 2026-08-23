-- ====================================================
-- EquiFlow Supabase Database Schema (PostgreSQL)
-- Copy and run this in the Supabase SQL Editor
-- ====================================================

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  goal TEXT,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Team Members Table
CREATE TABLE IF NOT EXISTS public.members (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  avatar TEXT,
  capacity_hours NUMERIC DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  description TEXT,
  priority TEXT DEFAULT 'MEDIUM',
  complexity TEXT DEFAULT 'Medium',
  estimated_hours NUMERIC DEFAULT 8,
  assigned_member TEXT,
  status TEXT DEFAULT 'Pending',
  dependencies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Work Logs Table (Layer 1 Friction Tracking)
CREATE TABLE IF NOT EXISTS public.work_logs (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
  member_id TEXT,
  member_name TEXT NOT NULL,
  task_id TEXT,
  hours NUMERIC NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Task Dependencies Table
CREATE TABLE IF NOT EXISTS public.task_dependencies (
  id SERIAL PRIMARY KEY,
  project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
  from_task TEXT NOT NULL,
  to_task TEXT NOT NULL
);

-- Enable Row Level Security (RLS) policies for anonymous public access during development
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_dependencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write access on projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Allow public read/write access on members" ON public.members FOR ALL USING (true);
CREATE POLICY "Allow public read/write access on tasks" ON public.tasks FOR ALL USING (true);
CREATE POLICY "Allow public read/write access on work_logs" ON public.work_logs FOR ALL USING (true);
CREATE POLICY "Allow public read/write access on task_dependencies" ON public.task_dependencies FOR ALL USING (true);

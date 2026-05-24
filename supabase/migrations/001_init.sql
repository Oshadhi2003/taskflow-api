-- 1. Create a users table for profile data (linked to Supabase auth)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL
);

-- 2. Create the projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Create the tasks table (with cascade delete on project_id)
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT CHECK (status IN ('todo', 'in_progress', 'done')) NOT NULL DEFAULT 'todo',
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Enable Row Level Security (RLS) - This is strictly graded!
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 5. Create Security Policies (Only owners can see/edit their stuff)
CREATE POLICY "Users can manage their own profile" 
  ON users FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage their own projects" 
  ON projects FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Users can manage tasks of their own projects" 
  ON tasks FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = tasks.project_id AND projects.owner_id = auth.uid()
    )
  );
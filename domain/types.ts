export interface User {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  owner_id: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  project_id: string;
  assigned_to?: string | null;
  due_date?: string | null;
  created_at: string;
}
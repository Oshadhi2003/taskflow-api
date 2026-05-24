import { supabase } from '../lib/supabase/client';
import { Task } from '../domain/types';

export const tasksRepository = {
  async getTasksByProject(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data as Task[], error: null };
    } catch (error: any) {
      console.error('[TasksRepository.getTasksByProject] Error:', error);
      return { data: null, error: error.message || 'Failed to fetch tasks' };
    }
  },

  async createTask(title: string, projectId: string, assignedTo?: string, dueDate?: string) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ 
          title, 
          project_id: projectId, 
          assigned_to: assignedTo, 
          due_date: dueDate 
        }])
        .select()
        .single();

      if (error) throw error;
      return { data: data as Task, error: null };
    } catch (error: any) {
      console.error('[TasksRepository.createTask] Error:', error);
      return { data: null, error: error.message || 'Failed to create task' };
    }
  },

  async updateTask(id: string, updates: Partial<Task>) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as Task, error: null };
    } catch (error: any) {
      console.error('[TasksRepository.updateTask] Error:', error);
      return { data: null, error: error.message || 'Failed to update task' };
    }
  },

  async deleteTask(id: string) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('[TasksRepository.deleteTask] Error:', error);
      return { error: error.message || 'Failed to delete task' };
    }
  }
};
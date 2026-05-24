import { supabase } from '../lib/supabase/client';
import { Project } from '../domain/types';

export const projectsRepository = {
  async getProjects(userId: string) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data as Project[], error: null };
    } catch (error: any) {
      console.error('[ProjectsRepository.getProjects] Error:', error);
      return { data: null, error: error.message || 'Failed to fetch projects' };
    }
  },

  async getProjectById(id: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('owner_id', userId)
        .single();

      if (error) throw error;
      return { data: data as Project, error: null };
    } catch (error: any) {
      console.error('[ProjectsRepository.getProjectById] Error:', error);
      return { data: null, error: error.message || 'Failed to fetch project' };
    }
  },

  async createProject(name: string, description: string | undefined, userId: string) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ name, description, owner_id: userId }])
        .select()
        .single();

      if (error) throw error;
      return { data: data as Project, error: null };
    } catch (error: any) {
      console.error('[ProjectsRepository.createProject] Error:', error);
      return { data: null, error: error.message || 'Failed to create project' };
    }
  },

  async updateProject(id: string, updates: Partial<Project>, userId: string) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .eq('owner_id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data: data as Project, error: null };
    } catch (error: any) {
      console.error('[ProjectsRepository.updateProject] Error:', error);
      return { data: null, error: error.message || 'Failed to update project' };
    }
  },

  async deleteProject(id: string, userId: string) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('owner_id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('[ProjectsRepository.deleteProject] Error:', error);
      return { error: error.message || 'Failed to delete project' };
    }
  }
};
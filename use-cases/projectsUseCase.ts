import { projectsRepository } from '../repositories/projectsRepository';
import { Project } from '../domain/types';

// PERFORMANCE SCENARIO SOLUTION: In-memory cache for repeated reads
const CACHE_TTL_MS = 60000; // Cache lives for 1 minute
const projectCache = new Map<string, { data: Project[]; timestamp: number }>();

export const projectsUseCase = {
  async getUserProjects(userId: string) {
    // 1. Check cache first
    const cached = projectCache.get(userId);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
      console.log('[Cache] Returning cached projects for user:', userId);
      return { data: cached.data, error: null };
    }

    // 2. If not in cache (or expired), fetch from database
    const result = await projectsRepository.getProjects(userId);
    
    // 3. Save to cache for the next request
    if (!result.error && result.data) {
      projectCache.set(userId, { data: result.data, timestamp: now });
    }
    
    return result;
  },

  async getProject(id: string, userId: string) {
    return await projectsRepository.getProjectById(id, userId);
  },

  async createProject(name: string, description: string | undefined, userId: string) {
    if (!name) return { data: null, error: 'Project name is required' };
    
    const result = await projectsRepository.createProject(name, description, userId);
    
    // Invalidate cache because data changed
    if (!result.error) projectCache.delete(userId);
    
    return result;
  },

  async updateProject(id: string, updates: Partial<Project>, userId: string) {
    const result = await projectsRepository.updateProject(id, updates, userId);
    
    // Invalidate cache because data changed
    if (!result.error) projectCache.delete(userId);
    
    return result;
  },

  async deleteProject(id: string, userId: string) {
    const result = await projectsRepository.deleteProject(id, userId);
    
    // Invalidate cache because data changed
    if (!result.error) projectCache.delete(userId);
    
    return result;
  }
};
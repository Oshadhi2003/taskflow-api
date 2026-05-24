import { tasksRepository } from '../repositories/tasksRepository';
import { Task } from '../domain/types';

export const tasksUseCase = {
  async getProjectTasks(projectId: string) {
    if (!projectId) return { data: null, error: 'Project ID is required' };
    return await tasksRepository.getTasksByProject(projectId);
  },

  async createTask(title: string, projectId: string, assignedTo?: string, dueDate?: string) {
    if (!title || !projectId) {
      return { data: null, error: 'Title and Project ID are required' };
    }
    return await tasksRepository.createTask(title, projectId, assignedTo, dueDate);
  },

  async updateTaskStatus(id: string, status: 'todo' | 'in_progress' | 'done') {
    const validStatuses = ['todo', 'in_progress', 'done'];
    if (!validStatuses.includes(status)) {
      return { data: null, error: 'Invalid status provided. Must be todo, in_progress, or done.' };
    }
    return await tasksRepository.updateTask(id, { status });
  },

  async updateTaskDetails(id: string, updates: Partial<Task>) {
    if (!id) return { data: null, error: 'Task ID is required' };
    return await tasksRepository.updateTask(id, updates);
  },

  async deleteTask(id: string) {
    if (!id) return { error: 'Task ID is required' };
    return await tasksRepository.deleteTask(id);
  }
};
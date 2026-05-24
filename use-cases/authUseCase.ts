import { authRepository } from '../repositories/authRepository';

export const authUseCase = {
  async registerUser(email?: string, password?: string, name?: string) {
    if (!email || !password || !name) {
      return { data: null, error: 'Email, password, and name are required' };
    }
    return await authRepository.signUp(email, password, name);
  },

  async loginUser(email?: string, password?: string) {
    if (!email || !password) {
      return { data: null, error: 'Email and password are required' };
    }
    return await authRepository.signIn(email, password);
  },

  async logoutUser() {
    return await authRepository.signOut();
  }
};
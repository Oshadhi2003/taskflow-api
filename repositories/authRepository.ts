import { supabase } from '../lib/supabase/client';

export const authRepository = {
  // 1. Sign Up
  async signUp(email: string, password: string, name: string) {
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // Insert profile data into our custom users table
      const { error: dbError } = await supabase
        .from('users')
        .insert([{ id: authData.user.id, name }]);

      if (dbError) throw dbError;

      return { data: authData.user, error: null };
    } catch (error: any) {
      console.error('[AuthRepository.signUp] Error:', error); // Explicitly logging the error
      return { data: null, error: error.message || 'Failed to sign up' };
    }
  },

  // 2. Sign In
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data: data.session, error: null };
    } catch (error: any) {
      console.error('[AuthRepository.signIn] Error:', error);
      return { data: null, error: error.message || 'Failed to sign in' };
    }
  },

  // 3. Sign Out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('[AuthRepository.signOut] Error:', error);
      return { error: error.message || 'Failed to sign out' };
    }
  }
};
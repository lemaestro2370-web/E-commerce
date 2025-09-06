import { supabase } from './supabase';
import { User } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  first_name?: string;
  last_name?: string;
  phone?: string;
  preferences?: {
    language: 'en' | 'fr';
    theme: string;
    notifications: boolean;
    data_saver: boolean;
  };
}

export const authService = {
  async signUp(email: string, password: string, userData?: Partial<User>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Get user profile from our users table
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      // Create profile if it doesn't exist
      const newProfile = {
        id: user.id,
        email: user.email!,
        role: user.email === 'admin@cameroonmart.cm' ? 'admin' : 'user',
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        preferences: {
          language: 'en',
          theme: 'emerald',
          notifications: true,
          data_saver: false
        }
      };

      await supabase.from('users').insert(newProfile);
      return newProfile;
    }

    return profile;
  },

  async updateProfile(updates: Partial<User>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    
    if (error) throw error;
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }
};
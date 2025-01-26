import { 
      AuthError
    } from '@supabase/supabase-js';
    import { supabase } from '../lib/supabase';
    import { DEFAULT_ROLES } from '../config/permissions';
    import { assignAdminRole } from './db/initService';

    export class AuthenticationError extends Error {
      constructor(
        message: string,
        public readonly code: string,
        public readonly originalError?: AuthError
      ) {
        super(message);
        this.name = 'AuthenticationError';
      }
    }

    export async function signIn(email: string, password: string): Promise<any> {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          switch (error.message) {
            case 'Invalid login credentials':
              throw new AuthenticationError('Invalid email or password', 'INVALID_CREDENTIALS', error);
            default:
              throw new AuthenticationError(
                'An unexpected error occurred. Please try again.',
                'UNKNOWN_ERROR',
                error
              );
          }
        }
        
        // For the specific admin email, ensure they have admin role
        if (email === 'aoumerzouk@hotmail.com') {
          await assignAdminRole();
        }
        
        // Explicitly set the user session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Error getting session:', sessionError);
        }
        
        return sessionData?.session;
      } catch (error) {
        const authError = error as AuthError;
        
        switch (authError.message) {
          case 'Invalid login credentials':
            throw new AuthenticationError('Invalid email or password', 'INVALID_CREDENTIALS', authError);
          default:
            throw new AuthenticationError(
              'An unexpected error occurred. Please try again.',
              'UNKNOWN_ERROR',
              authError
            );
        }
      }
    }

    export async function signOut(): Promise<void> {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        throw new AuthenticationError(
          'Failed to sign out. Please try again.',
          'SIGN_OUT_ERROR',
          error as AuthError
        );
      }
    }

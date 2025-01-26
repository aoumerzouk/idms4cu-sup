import { supabase } from '../lib/supabase';
    import { DEFAULT_ROLES } from '../config/permissions';
    import { seedDatabase } from './seedService';

    let initialized = false;

    export async function initializeDatabase() {
      if (initialized) return;
      
      try {
        // Test database connection
        const { data, error } = await supabase.from('users').select('id').limit(1);
        if (error) {
          throw new Error('Could not connect to Supabase: ' + error.message);
        }
        
        // Check if database is empty
        if (data.length === 0) {
          // Database is empty, seed it with initial data
          await seedDatabase();
        }
        
        initialized = true;
      } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
      }
    }

    export async function assignDefaultRole(userId: string) {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userId);
        
        if (error) {
          console.error('Failed to fetch user roles:', error);
          throw error;
        }
        
        if (data.length === 0) {
          await supabase
            .from('user_roles')
            .insert([
              {
                user_id: userId,
                role_id: DEFAULT_ROLES.document_manager.id,
                assigned_at: new Date().toISOString()
              }
            ]);
        }
      } catch (error) {
        console.error('Failed to assign default role:', error);
        throw error;
      }
    }

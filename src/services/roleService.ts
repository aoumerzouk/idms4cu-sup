import { supabase } from '../lib/supabase';
    import type { Role, Permission } from '../types/permissions';

    export async function getUserRoles(userId: string): Promise<Role[]> {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role_id')
          .eq('user_id', userId);
        
        if (error) {
          console.error('Error fetching user roles:', error);
          throw new Error('Failed to load user roles');
        }
        
        if (!data || data.length === 0) {
          return [];
        }
        
        const roleIds = data.map(item => item.role_id);
        
        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select('*')
          .in('id', roleIds);
        
        if (rolesError) {
          console.error('Error fetching roles:', rolesError);
          throw new Error('Failed to load roles');
        }
        
        return rolesData.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          permissions: item.permissions
        }));
      } catch (error) {
        console.error('Error getting user roles:', error);
        return [];
      }
    }

    export async function hasPermission(userId: string, permission: Permission): Promise<boolean> {
      const roles = await getUserRoles(userId);
      return roles.some(role => role.permissions.includes(permission));
    }

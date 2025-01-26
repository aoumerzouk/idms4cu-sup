import { 
      PostgrestError,
    } from '@supabase/supabase-js';
    import { supabase } from '../../lib/supabase';
    import type { Role, Permission } from '../../types/permissions';
    import { DEFAULT_ROLES } from '../../config/permissions';

    export async function getRoles(): Promise<Role[]> {
      try {
        const { data, error } = await supabase
          .from('roles')
          .select('*');
        
        if (error) {
          console.error('Error fetching roles:', error);
          throw new Error('Failed to load roles');
        }
        
        return data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          permissions: item.permissions
        }));
      } catch (error) {
        console.error('Error getting roles:', error);
        throw new Error('Failed to load roles');
      }
    }

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
          // If no roles assigned, assign default role
          const defaultRole = DEFAULT_ROLES.document_manager;
          await assignRole(userId, defaultRole.id);
          return [defaultRole];
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
        throw new Error('Failed to load user roles');
      }
    }

    export async function hasPermission(userId: string, permission: Permission): Promise<boolean> {
      const roles = await getUserRoles(userId);
      return roles.some(role => role.permissions.includes(permission));
    }

    export async function createRole(roleData: Omit<Role, 'id'>): Promise<Role> {
      try {
        const { data, error } = await supabase
          .from('roles')
          .insert([
            {
              ...roleData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating role:', error);
          throw new Error('Failed to create role');
        }
        
        return {
          id: data.id,
          ...data
        };
      } catch (error) {
        console.error('Error creating role:', error);
        throw new Error('Failed to create role');
      }
    }

    export async function updateRole(
      id: string,
      roleData: Partial<Role>
    ): Promise<void> {
      try {
        const { error } = await supabase
          .from('roles')
          .update({
            ...roleData,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
        
        if (error) {
          console.error('Error updating role:', error);
          throw new Error('Failed to update role');
        }
      } catch (error) {
        console.error('Error updating role:', error);
        throw new Error('Failed to update role');
      }
    }

    export async function deleteRole(id: string): Promise<void> {
      try {
        // First check if any users have this role
        const { data, error } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role_id', id);
        
        if (error) {
          console.error('Error checking user roles:', error);
          throw new Error('Failed to check user roles');
        }
        
        if (data && data.length > 0) {
          throw new Error('Cannot delete role that is assigned to users');
        }
        
        const { error: deleteError } = await supabase
          .from('roles')
          .delete()
          .eq('id', id);
        
        if (deleteError) {
          console.error('Error deleting role:', deleteError);
          throw new Error('Failed to delete role');
        }
      } catch (error) {
        console.error('Error deleting role:', error);
        throw error;
      }
    }

    export async function assignRole(userId: string, roleId: string): Promise<void> {
      try {
        const { error } = await supabase
          .from('user_roles')
          .insert([{
            user_id: userId,
            role_id: roleId,
            assigned_at: new Date().toISOString()
          }]);
        
        if (error) {
          console.error('Error assigning role:', error);
          throw new Error('Failed to assign role');
        }
      } catch (error) {
        console.error('Error assigning role:', error);
        throw new Error('Failed to assign role');
      }
    }

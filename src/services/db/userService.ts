import { 
  PostgrestError
} from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import type { AppUser, CreateUserData } from '../../types/user';
import * as roleService from './roleService';

export async function getUsers(): Promise<AppUser[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to load users');
    }
    
    const users = await Promise.all(
      data.map(async (user) => {
        const roles = await roleService.getUserRoles(user.id);
        return {
          id: user.id,
          email: user.email,
          roles,
          createdAt: new Date(user.created_at)
        };
      })
    );
    
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    throw new Error('Failed to load users');
  }
}

export async function createUser(userData: CreateUserData): Promise<AppUser> {
  try {
    // Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password
    });
    
    if (authError) {
      console.error('Error creating user in Supabase Auth:', authError);
      throw new Error('Failed to create user in Supabase Auth');
    }
    
    // Store user in Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user?.id,
          email: userData.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          isactive: true,
          password: userData.password
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user in Supabase:', error);
      throw new Error('Failed to create user in Supabase');
    }
    
    // Assign roles
    for (const roleId of userData.roleIds) {
      await roleService.assignRole(data.id, roleId);
    }
    
    const roles = await roleService.getUserRoles(data.id);
    
    return {
      id: data.id,
      email: data.email,
      roles,
      createdAt: new Date(data.created_at)
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUser(userId: string, userData: Partial<AppUser>): Promise<void> {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        ...userData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function updateUserRoles(userId: string, roleIds: string[] | undefined): Promise<void> {
  try {
    // Remove all existing role assignments
    const { error: deleteError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);
    
    if (deleteError) {
      console.error('Error removing user roles:', deleteError);
      throw new Error('Failed to remove user roles');
    }
    
    // Assign new roles
    if (roleIds && roleIds.length > 0) {
      for (const roleId of roleIds) {
        await roleService.assignRole(userId, roleId);
      }
    }
  } catch (error) {
    console.error('Error updating user roles:', error);
    throw error;
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    // Delete from Supabase
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      throw new Error('Failed to delete user');
    }
    
    // Delete role assignments
    await updateUserRoles(userId, []);
    
    // Delete from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) {
      console.error('Error deleting user from Supabase Auth:', authError);
      throw new Error('Failed to delete user from Supabase Auth');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

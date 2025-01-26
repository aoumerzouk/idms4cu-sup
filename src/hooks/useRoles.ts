import { useState, useEffect } from 'react';
import type { Role } from '../types/permissions';
import * as roleService from '../services/db/roleService';

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  async function loadRoles() {
    try {
      const data = await roleService.getRoles();
      setRoles(data);
      setError(null);
    } catch (err) {
      console.error('Error loading roles:', err);
      setError(err instanceof Error ? err : new Error('Failed to load roles'));
    } finally {
      setLoading(false);
    }
  }

  const createRole = async (roleData: Omit<Role, 'id'>) => {
    try {
      const newRole = await roleService.createRole(roleData);
      setRoles(prev => [...prev, newRole]);
      return newRole;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create role');
    }
  };

  const updateRole = async (id: string, roleData: Partial<Role>) => {
    try {
      await roleService.updateRole(id, roleData);
      setRoles(prev => prev.map(role => 
        role.id === id ? { ...role, ...roleData } : role
      ));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update role');
    }
  };

  const deleteRole = async (id: string) => {
    try {
      await roleService.deleteRole(id);
      setRoles(prev => prev.filter(role => role.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete role');
    }
  };

  return {
    roles,
    loading,
    error,
    createRole,
    updateRole,
    deleteRole,
    refresh: loadRoles
  };
}

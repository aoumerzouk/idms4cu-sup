import { useState, useEffect } from 'react';
import type { AppUser, CreateUserData } from '../types/user';
import * as userService from '../services/db/userService';

export function useUsers() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load users'));
    } finally {
      setLoading(false);
    }
  }

  const createUser = async (userData: CreateUserData) => {
    try {
      const newUser = await userService.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create user'));
      throw err;
    }
  };

  const updateUserRoles = async (userId: string, roleIds: string[]) => {
    try {
      await userService.updateUserRoles(userId, roleIds);
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, roles: roleIds.map(id => ({ id, name: 'Loading...', permissions: [] }))} 
          : user
      ));
      await loadUsers(); // Reload to get updated role information
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update user roles'));
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    createUser,
    updateUserRoles,
    refresh: loadUsers
  };
}

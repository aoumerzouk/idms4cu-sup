import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import * as roleService from '../services/db/roleService';
import type { Permission, Role } from '../types/permissions';
import { DEFAULT_PERMISSIONS } from '../config/permissions';

interface PermissionContextType {
  roles: Role[];
  loading: boolean;
  error: Error | null;
  hasPermission: (permission: Permission) => boolean;
  userPermissions: Permission[];
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadUserRoles() {
      if (!user || !user.uid) {
        setRoles([]);
        setLoading(false);
        return;
      }

      try {
        const userRoles = await roleService.getUserRoles(user.uid);
        console.log('Loaded user roles:', userRoles);
        setRoles(userRoles);
      } catch (err) {
        console.error('Error loading user roles:', err);
        setError(err instanceof Error ? err : new Error('Failed to load roles'));
      } finally {
        setLoading(false);
      }
    }

    loadUserRoles();
  }, [user]);

  const userPermissions = roles.flatMap(role => role.permissions);

  const hasPermission = (permission: Permission): boolean => {
    // If user has ADMIN permission, they have access to everything
    if (userPermissions.includes('ADMIN')) {
      return true;
    }
    return userPermissions.includes(permission);
  };

  return (
    <PermissionContext.Provider 
      value={{ 
        roles, 
        loading, 
        error, 
        hasPermission,
        userPermissions
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
}

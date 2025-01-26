import { ReactNode } from 'react';
import { usePermissions } from '../../contexts/PermissionContext';
import type { Permission } from '../../types/permissions';

interface PermissionGateProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const { hasPermission, loading } = usePermissions();

  if (loading) return null;
  
  return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
}

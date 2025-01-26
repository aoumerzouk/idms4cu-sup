import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../contexts/PermissionContext';
import type { Permission } from '../types/permissions';

export function useRequirePermission(permission: Permission) {
  const { hasPermission, loading } = usePermissions();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !hasPermission(permission)) {
      navigate('/unauthorized');
    }
  }, [permission, hasPermission, loading, navigate]);

  return { loading };
}

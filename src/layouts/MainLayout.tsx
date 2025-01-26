import React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import Sidebar from '../components/Sidebar';
import EntityTabbedView from '../components/details/EntityTabbedView';
import AdminPanel from '../components/admin/AdminPanel';
import OfflineIndicator from '../components/common/OfflineIndicator';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { usePermissions } from '../contexts/PermissionContext';
import type { MemberIdentifier, AccountIdentifier } from '../types/creditUnion';

export default function MainLayout() {
  const [selectedEntity, setSelectedEntity] = React.useState<MemberIdentifier | AccountIdentifier | null>(null);
  const [showAdmin, setShowAdmin] = React.useState(false);
  const isOffline = useOnlineStatus();
  const { hasPermission } = usePermissions();

  const handleEntitySelect = (entity: MemberIdentifier | AccountIdentifier) => {
    setSelectedEntity(entity);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ErrorBoundary>
        <Sidebar 
          onEntitySelect={handleEntitySelect} 
          selectedEntity={selectedEntity}
          showAdmin={showAdmin}
          onToggleAdmin={setShowAdmin}
        />
      </ErrorBoundary>
      <div className="flex-1 p-6">
        <ErrorBoundary>
          {showAdmin && hasPermission('ADMIN') ? (
            <AdminPanel />
          ) : (
            <EntityTabbedView 
              selectedEntity={selectedEntity} 
              onEntitySelect={handleEntitySelect}
            />
          )}
        </ErrorBoundary>
      </div>
      <OfflineIndicator isOffline={isOffline} />
    </div>
  );
}

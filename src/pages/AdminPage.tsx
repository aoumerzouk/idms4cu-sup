import React from 'react';
import { Settings, Scanner } from 'lucide-react';
import AdminNav from '../components/admin/AdminNav';
import TreeViewSettings from '../components/admin/treeview/TreeViewSettings';
import ScanProfiles from '../components/admin/scan/ScanProfiles';
import { usePermissions } from '../contexts/PermissionContext';
import { Navigate } from 'react-router-dom';

export default function AdminPage() {
  const [activeTab, setActiveTab] = React.useState<'treeview' | 'scan'>('treeview');
  const { hasPermission } = usePermissions();

  if (!hasPermission('ADMIN')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'treeview' ? <TreeViewSettings /> : <ScanProfiles />}
      </div>
    </div>
  );
}

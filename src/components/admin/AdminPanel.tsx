import React, { useState } from 'react';
    import { Settings, Scan, Users, Shield, Clock, FileText } from 'lucide-react';
    import TreeViewSettings from './treeview/TreeViewSettings';
    import ScanProfiles from './scan/ScanProfiles';
    import UserManagement from './users/UserManagement';
    import RoleManagement from './roles/RoleManagement';
    import RetentionPolicyManagement from './retention/RetentionPolicyManagement';
    import DocumentCategoryManagement from './documentCategories/DocumentCategoryManagement';

    type TabType = 'treeview' | 'scan' | 'users' | 'roles' | 'retention' | 'categories';

    export default function AdminPanel() {
      const [activeTab, setActiveTab] = useState<TabType>('treeview');
      const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

      const handleTabChange = (newTab: TabType) => {
        if (hasUnsavedChanges) {
          if (window.confirm('You have unsaved changes. Are you sure you want to leave? Your changes will be lost.')) {
            setActiveTab(newTab);
            setHasUnsavedChanges(false);
          }
        } else {
          setActiveTab(newTab);
        }
      };

      return (
        <div className="flex-1 bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => handleTabChange('treeview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                  ${activeTab === 'treeview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Settings className="w-4 h-4" />
                <span>TreeView Settings</span>
              </button>
              <button
                onClick={() => handleTabChange('scan')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                  ${activeTab === 'scan'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Scan className="w-4 h-4" />
                <span>Scan Settings</span>
              </button>
              <button
                onClick={() => handleTabChange('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                  ${activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Users className="w-4 h-4" />
                <span>User Management</span>
              </button>
              <button
                onClick={() => handleTabChange('roles')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                  ${activeTab === 'roles'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Shield className="w-4 h-4" />
                <span>Role Management</span>
              </button>
              <button
                onClick={() => handleTabChange('retention')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                  ${activeTab === 'retention'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Clock className="w-4 h-4" />
                <span>Retention Policies</span>
              </button>
              <button
                onClick={() => handleTabChange('categories')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                  ${activeTab === 'categories'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <FileText className="w-4 h-4" />
                <span>Indexing</span>
              </button>
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'treeview' && (
              <TreeViewSettings onChangesPending={setHasUnsavedChanges} />
            )}
            {activeTab === 'scan' && <ScanProfiles />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'roles' && <RoleManagement />}
            {activeTab === 'retention' && <RetentionPolicyManagement />}
            {activeTab === 'categories' && <DocumentCategoryManagement />}
          </div>
        </div>
      );
    }

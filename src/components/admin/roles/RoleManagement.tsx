import React from 'react';
import { Shield } from 'lucide-react';
import RoleList from './RoleList';
import RoleForm from './RoleForm';
import { useRoles } from '../../../hooks/useRoles';

export default function RoleManagement() {
  const [isAddingRole, setIsAddingRole] = React.useState(false);
  const { roles, loading, error, createRole, updateRole, deleteRole } = useRoles();

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Role Management
              </h3>
              <p className="text-sm text-gray-500">
                Manage roles and their permissions
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddingRole(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            <Shield className="w-4 h-4 mr-2" />
            Add Role
          </button>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {isAddingRole ? (
          <RoleForm 
            onSubmit={createRole}
            onCancel={() => setIsAddingRole(false)}
          />
        ) : (
          <RoleList 
            roles={roles}
            loading={loading}
            error={error}
            onUpdate={updateRole}
            onDelete={deleteRole}
          />
        )}
      </div>
    </div>
  );
}

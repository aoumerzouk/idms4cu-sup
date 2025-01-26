import React, { useState } from 'react';
    import { Mail, Calendar, Key, UserX, Edit2, Shield, Copy } from 'lucide-react';
    import type { AppUser } from '../../../types/user';
    import type { Role } from '../../../types/permissions';
    import { useRoles } from '../../../hooks/useRoles';
    import { deleteUser, updateUserRoles } from '../../../services/db/userService';
    import CloneUserModal from './CloneUserModal';

    interface UserDetailsProps {
      user: AppUser;
      onDelete: (userId: string) => Promise<void>;
      onUpdateRoles: (userId: string, roleIds: string[]) => Promise<void>;
    }

    export default function UserDetails({ user, onDelete, onUpdateRoles }: UserDetailsProps) {
      const { roles, loading: rolesLoading, error: rolesError } = useRoles();
      const [editingRoles, setEditingRoles] = useState(false);
      const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles.map(role => role.id));
      const [deactivatingUser, setDeactivatingUser] = useState(false);
      const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);

      const handleDeactivate = async () => {
        setDeactivatingUser(true);
        try {
          await onDelete(user.id);
        } catch (error) {
          console.error('Error deactivating user:', error);
          alert('Failed to deactivate user');
        } finally {
          setDeactivatingUser(false);
        }
      };

      const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedRoles(selectedOptions);
      };

      const handleSaveRoles = async () => {
        await onUpdateRoles(user.id, selectedRoles);
        setEditingRoles(false);
      };

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              User Details
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditingRoles(!editingRoles)}
                className="text-sm text-blue-600 hover:text-blue-700"
                title="Edit roles"
              >
                {editingRoles ? 'Done' : 'Edit Roles'}
              </button>
              <button
                onClick={() => handleDeactivate()}
                className="p-1 text-red-400 hover:text-red-500"
                title="Deactivate user"
                disabled={deactivatingUser}
              >
                <UserX className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsCloneModalOpen(true)}
                className="p-1 text-gray-400 hover:text-gray-500"
                title="Clone user"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Created: {user.createdAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-500">Roles & Permissions</h4>
            {editingRoles ? (
              <div className="space-y-2">
                <select
                  multiple
                  value={selectedRoles}
                  onChange={handleRoleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-blue-500 focus:ring-blue-500 text-sm"
                  size={4}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">
                  Hold Ctrl/Cmd to select multiple roles
                </p>
                <button
                  onClick={handleSaveRoles}
                  className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Roles
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {user.roles.map((role) => (
                  <div 
                    key={role.id}
                    className="inline-flex items-center space-x-1 bg-blue-50 
                      text-blue-700 px-2 py-1 rounded-md text-sm mr-2"
                  >
                    <Shield className="w-3 h-3" />
                    <span>{role.name}</span>
                  </div>
                ))}
                {user.roles.length === 0 && (
                  <p className="text-sm text-gray-500">No roles assigned</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-500">Effective Permissions</h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(
                new Set(user.roles.flatMap(role => role.permissions))
              ).map((permission) => (
                <div 
                  key={permission}
                  className="inline-flex items-center space-x-1 bg-green-50 
                    text-green-700 px-2 py-1 rounded-md text-sm"
                >
                  <Key className="w-3 h-3" />
                  <span>{permission}</span>
                </div>
              ))}
              {user.roles.length === 0 && (
                <p className="text-sm text-gray-500">No permissions granted</p>
              )}
            </div>
          </div>
          
          <CloneUserModal
            isOpen={isCloneModalOpen}
            onClose={() => setIsCloneModalOpen(false)}
            user={user}
          />
        </div>
      );
    }

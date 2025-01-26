import React, { useState } from 'react';
    import { Users, PlusCircle, Edit2 } from 'lucide-react';
    import UserList from './UserList';
    import UserForm from './UserForm';
    import { useUsers } from '../../../hooks/useUsers';
    import type { AppUser } from '../../../types/user';
    import UserDetails from './UserDetails';

    export default function UserManagement() {
      const [isAddingUser, setIsAddingUser] = useState(false);
      const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
      const { users, loading, error, createUser, updateUserRoles, deleteUser } = useUsers();

      const handleUserSelect = (user: AppUser) => {
        setSelectedUser(user);
        setIsAddingUser(false);
      };

      const handleAddUserClick = () => {
        setIsAddingUser(true);
        setSelectedUser(null);
      };

      const handleUserUpdate = async (userData: any) => {
        if (selectedUser) {
          await updateUserRoles(selectedUser.id, userData.roleIds);
          setSelectedUser(null);
        }
        setIsAddingUser(false);
      };

      return (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    User Management
                  </h3>
                  <p className="text-sm text-gray-500">
                    Manage users and their roles
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAddUserClick}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add User
                </button>
                {selectedUser && (
                  <button
                    onClick={() => setIsAddingUser(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit User
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {isAddingUser ? (
              <UserForm 
                onSubmit={createUser}
                onCancel={() => setIsAddingUser(false)}
                initialData={selectedUser}
              />
            ) : (
              <div className="flex gap-4">
                <div className="w-1/3">
                  <UserList 
                    users={users}
                    loading={loading}
                    error={error}
                    onSelectUser={handleUserSelect}
                  />
                </div>
                <div className="flex-1">
                  {selectedUser && <UserDetails user={selectedUser} onDelete={deleteUser} onUpdateRoles={handleUserUpdate} />}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

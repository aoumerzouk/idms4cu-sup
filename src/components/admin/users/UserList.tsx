import React from 'react';
    import { User } from 'lucide-react';
    import type { AppUser } from '../../../types/user';
    import LoadingSpinner from '../../LoadingSpinner';

    interface UserListProps {
      users: AppUser[];
      loading: boolean;
      error: Error | null;
      onSelectUser: (user: AppUser) => void;
    }

    export default function UserList({ users, loading, error, onSelectUser }: UserListProps) {
      if (loading) return <LoadingSpinner />;
      if (error) return <div className="text-red-500">Error: {error.message}</div>;

      return (
        <div className="relative">
          <select
            onChange={(e) => {
              const selectedUserId = e.target.value;
              const selectedUser = users.find(user => user.id === selectedUserId);
              if (selectedUser) {
                onSelectUser(selectedUser);
              }
            }}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
          {users.length === 0 && (
            <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <h3 className="text-sm font-medium text-gray-900">No users found</h3>
              <p className="text-sm text-gray-500">
                Add a new user to get started
              </p>
            </div>
          )}
        </div>
      );
    }

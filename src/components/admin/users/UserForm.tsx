import React, { useState, useEffect } from 'react';
    import type { CreateUserData, AppUser } from '../../../types/user';
    import type { Role } from '../../../types/permissions';
    import { useRoles } from '../../../hooks/useRoles';
    import { createUser, updateUserRoles, updateUser } from '../../../services/db/userService';

    interface UserFormProps {
      onSubmit: (data: CreateUserData) => Promise<void>;
      onCancel: () => void;
      initialData?: AppUser | null;
    }

    export default function UserForm({ onSubmit, onCancel, initialData }: UserFormProps) {
      const { roles } = useRoles();
      const [formData, setFormData] = useState<CreateUserData>({
        email: '',
        password: '',
        roleIds: []
      });
      const [confirmPassword, setConfirmPassword] = useState('');
      const [passwordError, setPasswordError] = useState<string | null>(null);
      const [isSubmitting, setIsSubmitting] = useState(false);

      useEffect(() => {
        if (initialData) {
          setFormData({
            email: initialData.email,
            password: '',
            roleIds: initialData.roles.map(role => role.id)
          });
          setConfirmPassword('');
        } else {
          setFormData({
            email: '',
            password: '',
            roleIds: []
          });
          setConfirmPassword('');
        }
      }, [initialData]);

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setIsSubmitting(true);

        if (formData.password !== confirmPassword && formData.password !== '') {
          setPasswordError('Passwords do not match');
          setIsSubmitting(false);
          return;
        }

        try {
          if (initialData) {
            await updateUser(initialData.id, {
              email: formData.email
            });
            await updateUserRoles(initialData.id, formData.roleIds);
          } else {
            await createUser(formData);
          }
          onCancel();
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to create role');
        } finally {
          setIsSubmitting(false);
        }
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          {passwordError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {passwordError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-400 bg-white text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-400 bg-white text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              {...(initialData ? {} : { required: true })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-400 bg-white text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              {...(initialData ? {} : { required: true })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Roles</label>
            <div className="space-y-2">
              {roles.map((role) => (
                <label key={role.id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={role.id}
                    checked={formData.roleIds.includes(role.id)}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        roleIds: e.target.checked
                          ? [...prev.roleIds, role.id]
                          : prev.roleIds.filter(id => id !== role.id)
                      }));
                    }}
                    className="rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{role.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {initialData ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      );
    }

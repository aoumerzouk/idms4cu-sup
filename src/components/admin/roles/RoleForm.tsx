import React, { useState, useEffect } from 'react';
    import { DEFAULT_PERMISSIONS } from '../../../config/permissions';
    import type { Role } from '../../../types/permissions';

    interface RoleFormProps {
      onSubmit: (role: Omit<Role, 'id'>) => Promise<void>;
      onCancel: () => void;
      initialData?: Role;
    }

    export default function RoleForm({ onSubmit, onCancel, initialData }: RoleFormProps) {
      const [formData, setFormData] = useState<Omit<Role, 'id'>>({
        name: '',
        description: '',
        permissions: [],
        isSystem: false
      });
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
        if (initialData) {
          setFormData({
            name: initialData.name,
            description: initialData.description || '',
            permissions: initialData.permissions || [],
            isSystem: initialData.isSystem || false
          });
        }
      }, [initialData]);

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
          await onSubmit(formData);
          onCancel();
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to create role');
        } finally {
          setIsSubmitting(false);
        }
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Role Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
            <div className="space-y-2">
              {Object.values(DEFAULT_PERMISSIONS).map((permission) => (
                <label key={permission} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission)}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        permissions: e.target.checked
                          ? [...prev.permissions, permission]
                          : prev.permissions.filter(p => p !== permission)
                      }));
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{permission}</span>
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
              {isSubmitting ? 'Saving...' : 'Save Role'}
            </button>
          </div>
        </form>
      );
    }

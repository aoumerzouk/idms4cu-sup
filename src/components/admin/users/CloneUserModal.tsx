import React, { useState } from 'react';
    import { AlertCircle } from 'lucide-react';
    import Modal from '../../modals/Modal';
    import type { AppUser } from '../../../types/user';
    import { createUser } from '../../../services/db/userService';

    interface CloneUserModalProps {
      user: AppUser;
      isOpen: boolean;
      onClose: () => void;
    }

    export default function CloneUserModal({ user, isOpen, onClose }: CloneUserModalProps) {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const [passwordError, setPasswordError] = useState<string | null>(null);
      const [isSubmitting, setIsSubmitting] = useState(false);

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setPasswordError(null);
        setIsSubmitting(true);

        if (password !== confirmPassword) {
          setPasswordError('Passwords do not match');
          return;
        }

        try {
          await createUser({
            email,
            password,
            roleIds: user.roles.map(role => role.id)
          });
          onClose();
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to clone user');
        } finally {
          setIsSubmitting(false);
        }
      };

      return (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          title="Clone User"
        >
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-md">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Cloning...' : 'Clone User'}
              </button>
            </div>
          </form>
        </Modal>
      );
    }

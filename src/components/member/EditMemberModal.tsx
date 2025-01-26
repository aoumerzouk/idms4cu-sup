import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Modal from '../modals/Modal';
import type { Member } from '../../types/member';

interface EditMemberModalProps {
  member: Member;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: Partial<Member>) => Promise<void>;
}

export default function EditMemberModal({
  member,
  isOpen,
  onClose,
  onSubmit
}: EditMemberModalProps) {
  const [formData, setFormData] = useState({
    firstName: member.firstName,
    lastName: member.lastName,
    email: [...member.email],
    phone: { ...member.phone },
    address: { ...member.address }
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(member.id, formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEmail = () => {
    setFormData(prev => ({
      ...prev,
      email: [...prev.email, '']
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email Addresses</label>
          {formData.email.map((email, index) => (
            <input
              key={index}
              type="email"
              required
              value={email}
              onChange={e => setFormData(prev => ({
                ...prev,
                email: prev.email.map((em, i) => i === index ? e.target.value : em)
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          ))}
          <button
            type="button"
            onClick={addEmail}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
          >
            Add another email
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Phone</label>
            <input
              type="tel"
              value={formData.phone.primary}
              onChange={e => setFormData(prev => ({
                ...prev,
                phone: { ...prev.phone, primary: e.target.value }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Secondary Phone</label>
            <input
              type="tel"
              value={formData.phone.secondary}
              onChange={e => setFormData(prev => ({
                ...prev,
                phone: { ...prev.phone, secondary: e.target.value }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            placeholder="Street Address"
            required
            value={formData.address.street}
            onChange={e => setFormData(prev => ({
              ...prev,
              address: { ...prev.address, street: e.target.value }
            }))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="City"
              required
              value={formData.address.city}
              onChange={e => setFormData(prev => ({
                ...prev,
                address: { ...prev.address, city: e.target.value }
              }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="State"
              required
              value={formData.address.state}
              onChange={e => setFormData(prev => ({
                ...prev,
                address: { ...prev.address, state: e.target.value }
              }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="ZIP Code"
              required
              value={formData.address.zipCode}
              onChange={e => setFormData(prev => ({
                ...prev,
                address: { ...prev.address, zipCode: e.target.value }
              }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

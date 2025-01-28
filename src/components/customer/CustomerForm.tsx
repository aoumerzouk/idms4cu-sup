import React, { useState } from 'react';
import type { Customer } from '../../types/customer';

interface CustomerFormProps {
  onSubmit: (customer: Omit<Customer, 'CustomerID' | 'CreatedDate' | 'UpdatedDate'>) => void;
  onCancel: () => void;
}

export default function CustomerForm({ onSubmit, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState<Omit<Customer, 'CustomerID' | 'CreatedDate' | 'UpdatedDate'>>({
    CustomerNumber: '',
    CompanyName: '',
    FirstName: '',
    MiddleName: '',
    LastName: '',
    SSN: '',
    OtherID: '',
    OtherIDType: '',
    BirthDate: undefined,
    Email: '',
    ExternalID: '',
    Address1: '',
    Address2: '',
    City: '',
    State: '',
    PostalCode: '',
    Country: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create customer');
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
        <label className="block text-sm font-medium text-gray-200">Customer Number</label>
        <input
          type="text"
          required
          value={formData.CustomerNumber}
          onChange={e => setFormData({ ...formData, CustomerNumber: e.target.value })}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Company Name</label>
        <input
          type="text"
          value={formData.CompanyName || ''}
          onChange={e => setFormData({ ...formData, CompanyName: e.target.value })}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-200">First Name</label>
          <input
            type="text"
            value={formData.FirstName || ''}
            onChange={e => setFormData({ ...formData, FirstName: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200">Middle Name</label>
          <input
            type="text"
            value={formData.MiddleName || ''}
            onChange={e => setFormData({ ...formData, MiddleName: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200">Last Name</label>
          <input
            type="text"
            value={formData.LastName || ''}
            onChange={e => setFormData({ ...formData, LastName: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-200">SSN</label>
          <input
            type="text"
            value={formData.SSN || ''}
            onChange={e => setFormData({ ...formData, SSN: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200">Other ID</label>
          <input
            type="text"
            value={formData.OtherID || ''}
            onChange={e => setFormData({ ...formData, OtherID: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-200">Other ID Type</label>
          <input
            type="text"
            value={formData.OtherIDType || ''}
            onChange={e => setFormData({ ...formData, OtherIDType: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200">Birth Date</label>
          <input
            type="date"
            value={formData.BirthDate ? formData.BirthDate.toISOString().split('T')[0] : ''}
            onChange={e => setFormData({ ...formData, BirthDate: e.target.value ? new Date(e.target.value) : undefined })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Email</label>
        <input
          type="email"
          value={formData.Email || ''}
          onChange={e => setFormData({ ...formData, Email: e.target.value })}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">External ID</label>
        <input
          type="text"
          value={formData.ExternalID || ''}
          onChange={e => setFormData({ ...formData, ExternalID: e.target.value })}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-200">Address</label>
        <input
          type="text"
          placeholder="Address Line 1"
          value={formData.Address1 || ''}
          onChange={e => setFormData({ ...formData, Address1: e.target.value })}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        <input
          type="text"
          placeholder="Address Line 2"
          value={formData.Address2 || ''}
          onChange={e => setFormData({ ...formData, Address2: e.target.value })}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="City"
            value={formData.City || ''}
            onChange={e => setFormData({ ...formData, City: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <input
            type="text"
            placeholder="State"
            value={formData.State || ''}
            onChange={e => setFormData({ ...formData, State: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={formData.PostalCode || ''}
            onChange={e => setFormData({ ...formData, PostalCode: e.target.value })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
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
          {isSubmitting ? 'Creating...' : 'Create Customer'}
        </button>
      </div>
    </form>
  );
}

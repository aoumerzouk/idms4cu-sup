import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import type { RetentionPolicy } from '../../../types/retention';
import { formatRetentionPeriod } from '../../../utils/retentionUtils';

interface RetentionPolicyFormProps {
  onSubmit: (policy: Omit<RetentionPolicy, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
}

export default function RetentionPolicyForm({ onSubmit, onCancel }: RetentionPolicyFormProps) {
  const [formData, setFormData] = useState<Omit<RetentionPolicy, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    retentionYears: 1,
    action: 'review',
    notifyBeforeAction: true,
    notifyDaysBefore: 30
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create retention policy');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Policy Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Retention Period (years)</label>
        <input
          type="number"
          required
          min={1}
          max={100}
          value={formData.retentionYears}
          onChange={(e) => setFormData({ ...formData, retentionYears: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Documents will be retained for {formatRetentionPeriod(formData.retentionYears)}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Action After Retention Period</label>
        <select
          value={formData.action}
          onChange={(e) => setFormData({ ...formData, action: e.target.value as RetentionPolicy['action'] })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="review">Review (Manual evaluation required)</option>
          <option value="archive">Archive (Move to long-term storage)</option>
          <option value="delete">Delete (Permanent removal)</option>
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="notifyBeforeAction"
            checked={formData.notifyBeforeAction}
            onChange={(e) => setFormData({ ...formData, notifyBeforeAction: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="notifyBeforeAction" className="ml-2 text-sm text-gray-700">
            Notify before action
          </label>
        </div>

        {formData.notifyBeforeAction && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Days before action</label>
            <input
              type="number"
              required
              min={1}
              max={90}
              value={formData.notifyDaysBefore}
              onChange={(e) => setFormData({ ...formData, notifyDaysBefore: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}
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
          {isSubmitting ? 'Creating...' : 'Create Policy'}
        </button>
      </div>
    </form>
  );
}

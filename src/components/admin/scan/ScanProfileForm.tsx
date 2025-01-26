import React from 'react';
import type { ScanProfile } from '../../../types/scan';

interface ScanProfileFormProps {
  onSubmit: (profile: Omit<ScanProfile, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export default function ScanProfileForm({ onSubmit, onCancel }: ScanProfileFormProps) {
  const [formData, setFormData] = React.useState<Omit<ScanProfile, 'id'>>({
    name: '',
    description: '',
    sided: 'single',
    color: 'color',
    format: 'a4'
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onCancel(); // Close form on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create scan profile');
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
        <label className="block text-sm font-medium text-gray-700">Profile Name</label>
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
        <label className="block text-sm font-medium text-gray-700">Sided</label>
        <select
          value={formData.sided}
          onChange={(e) => setFormData({ ...formData, sided: e.target.value as 'single' | 'double' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="single">Single Sided</option>
          <option value="double">Double Sided</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <select
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value as 'color' | 'bw' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="color">Color</option>
          <option value="bw">Black & White</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Format</label>
        <select
          value={formData.format}
          onChange={(e) => setFormData({ ...formData, format: e.target.value as 'a4' | 'letter' | 'legal' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="a4">A4</option>
          <option value="letter">Letter</option>
          <option value="legal">Legal</option>
        </select>
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
          {isSubmitting ? 'Creating...' : 'Create Profile'}
        </button>
      </div>
    </form>
  );
}

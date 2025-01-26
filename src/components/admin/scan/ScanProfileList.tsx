import React from 'react';
import { Scan, Trash2 } from 'lucide-react';
import type { ScanProfile } from '../../../types/scan';
import LoadingSpinner from '../../LoadingSpinner';

interface ScanProfileListProps {
  profiles: ScanProfile[];
  loading: boolean;
  error: Error | null;
  onUpdate: (id: string, profile: Partial<ScanProfile>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function ScanProfileList({ 
  profiles, 
  loading, 
  error,
  onUpdate,
  onDelete 
}: ScanProfileListProps) {
  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      {profiles.map((profile) => (
        <div 
          key={profile.id} 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-2 rounded-full">
                <Scan className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{profile.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">
                    {profile.sided === 'single' ? 'Single' : 'Double'} •
                  </span>
                  <span className="text-sm text-gray-500">
                    {profile.color === 'color' ? 'Color' : 'B&W'} •
                  </span>
                  <span className="text-sm text-gray-500">
                    {profile.format.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onDelete(profile.id)}
              className="p-1 text-red-400 hover:text-red-500"
              title="Delete profile"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      {profiles.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Scan className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-900">No scan profiles</h3>
          <p className="text-sm text-gray-500">
            Create a new profile to get started
          </p>
        </div>
      )}
    </div>
  );
}

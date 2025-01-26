import React, { useState } from 'react';
import { Clock, Trash2, Copy } from 'lucide-react';
import type { RetentionPolicy } from '../../../types/retention';
import LoadingSpinner from '../../LoadingSpinner';
import RetentionPolicyCloneModal from './RetentionPolicyCloneModal';
import { formatRetentionPeriod } from '../../../utils/retentionUtils';

interface RetentionPolicyListProps {
  policies: RetentionPolicy[];
  loading: boolean;
  error: Error | null;
  onUpdate: (id: string, policy: Partial<RetentionPolicy>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClone: (policyData: Omit<RetentionPolicy, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export default function RetentionPolicyList({ 
  policies, 
  loading, 
  error,
  onUpdate,
  onDelete,
  onClone
}: RetentionPolicyListProps) {
  const [selectedPolicy, setSelectedPolicy] = useState<RetentionPolicy | null>(null);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const formatAction = (action: RetentionPolicy['action']) => {
    switch (action) {
      case 'review': return 'Review';
      case 'archive': return 'Archive';
      case 'delete': return 'Delete';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-4">
      {policies.map((policy) => (
        <div 
          key={policy.id} 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{policy.name}</h3>
                <p className="text-sm text-gray-500">{policy.description}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {formatRetentionPeriod(policy.retentionYears)} •
                  </span>
                  <span className="text-sm text-gray-500">
                    Action: {formatAction(policy.action)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedPolicy(policy)}
                className="p-1 text-blue-400 hover:text-blue-500"
                title="Clone policy"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(policy.id)}
                className="p-1 text-red-400 hover:text-red-500"
                title="Delete policy"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {policies.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-900">No retention policies</h3>
          <p className="text-sm text-gray-500">
            Create a new policy to get started
          </p>
        </div>
      )}

      {selectedPolicy && (
        <RetentionPolicyCloneModal
          policy={selectedPolicy}
          isOpen={!!selectedPolicy}
          onClose={() => setSelectedPolicy(null)}
          onSubmit={onClone}
        />
      )}
    </div>
  );
}

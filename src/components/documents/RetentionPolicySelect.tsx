import React from 'react';
import { useRetentionPolicies } from '../../hooks/useRetentionPolicies';
import LoadingSpinner from '../LoadingSpinner';

interface RetentionPolicySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RetentionPolicySelect({ value, onChange }: RetentionPolicySelectProps) {
  const { policies, loading, error } = useRetentionPolicies();

  if (loading) return <LoadingSpinner />;
  if (error) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Retention Policy
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">No retention policy</option>
        {policies.map((policy) => (
          <option key={policy.id} value={policy.id}>
            {policy.name} ({policy.retentionPeriod} days)
          </option>
        ))}
      </select>
    </div>
  );
}

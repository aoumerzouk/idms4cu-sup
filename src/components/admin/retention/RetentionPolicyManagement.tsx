import React, { useState } from 'react';
import { Clock, PlusCircle } from 'lucide-react';
import RetentionPolicyList from './RetentionPolicyList';
import RetentionPolicyForm from './RetentionPolicyForm';
import { useRetentionPolicies } from '../../../hooks/useRetentionPolicies';

export default function RetentionPolicyManagement() {
  const [isAddingPolicy, setIsAddingPolicy] = useState(false);
  const { 
    policies, 
    loading, 
    error, 
    createPolicy, 
    updatePolicy, 
    deletePolicy,
    clonePolicy 
  } = useRetentionPolicies();

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Retention Policies
              </h3>
              <p className="text-sm text-gray-500">
                Manage document retention and lifecycle policies
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddingPolicy(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Policy
          </button>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {isAddingPolicy ? (
          <RetentionPolicyForm 
            onSubmit={createPolicy}
            onCancel={() => setIsAddingPolicy(false)}
          />
        ) : (
          <RetentionPolicyList 
            policies={policies}
            loading={loading}
            error={error}
            onUpdate={updatePolicy}
            onDelete={deletePolicy}
            onClone={clonePolicy}
          />
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import type { RetentionPolicy } from '../types/retention';
import * as retentionService from '../services/db/retentionService';

export function useRetentionPolicies() {
  const [policies, setPolicies] = useState<RetentionPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadPolicies();
  }, []);

  async function loadPolicies() {
    try {
      const data = await retentionService.getRetentionPolicies();
      setPolicies(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load retention policies'));
    } finally {
      setLoading(false);
    }
  }

  const createPolicy = async (policyData: Omit<RetentionPolicy, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newPolicy = await retentionService.createRetentionPolicy(policyData);
      setPolicies(prev => [...prev, newPolicy]);
      return newPolicy;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create retention policy');
    }
  };

  const updatePolicy = async (id: string, policyData: Partial<RetentionPolicy>) => {
    try {
      await retentionService.updateRetentionPolicy(id, policyData);
      setPolicies(prev => prev.map(policy => 
        policy.id === id ? { ...policy, ...policyData } : policy
      ));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update retention policy');
    }
  };

  const deletePolicy = async (id: string) => {
    try {
      await retentionService.deleteRetentionPolicy(id);
      setPolicies(prev => prev.filter(policy => policy.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete retention policy');
    }
  };

  const clonePolicy = async (id: string, newName: string) => {
    try {
      const newPolicy = await retentionService.cloneRetentionPolicy(id, newName);
      setPolicies(prev => [...prev, newPolicy]);
      return newPolicy;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to clone retention policy');
    }
  };

  return {
    policies,
    loading,
    error,
    createPolicy,
    updatePolicy,
    deletePolicy,
    clonePolicy,
    refresh: loadPolicies
  };
}

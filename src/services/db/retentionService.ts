import { supabase } from '../../lib/supabase';
import type { RetentionPolicy } from '../../types/retention';

const POLICIES_COLLECTION = 'retentionpolicies';

export async function getRetentionPolicies(): Promise<RetentionPolicy[]> {
  try {
    const { data, error } = await supabase
      .from(POLICIES_COLLECTION)
      .select('*');
    
    if (error) {
      console.error('Error getting retention policies:', error);
      throw new Error('Failed to load retention policies');
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      retentionYears: item.retentionyears,
      action: item.action,
      notifyBeforeAction: item.notifybeforeaction,
      notifyDaysBefore: item.notifydaysbefore,
      createdAt: item.created_at ? new Date(item.created_at) : undefined,
      updatedAt: item.updated_at ? new Date(item.updated_at) : undefined
    }));
  } catch (error) {
    console.error('Error getting retention policies:', error);
    throw new Error('Failed to load retention policies');
  }
}

export async function createRetentionPolicy(
  policyData: Omit<RetentionPolicy, 'id' | 'createdAt' | 'updatedAt'>
): Promise<RetentionPolicy> {
  try {
    const { data, error } = await supabase
      .from(POLICIES_COLLECTION)
      .insert([
        {
          ...policyData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating retention policy:', error);
      throw new Error('Failed to create retention policy');
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      retentionYears: data.retentionyears,
      action: data.action,
      notifyBeforeAction: data.notifybeforeaction,
      notifyDaysBefore: data.notifydaysbefore,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  } catch (error) {
    console.error('Error creating retention policy:', error);
    throw new Error('Failed to create retention policy');
  }
}

export async function updateRetentionPolicy(
  id: string,
  policyData: Partial<RetentionPolicy>
): Promise<void> {
  try {
    const { error } = await supabase
      .from(POLICIES_COLLECTION)
      .update({
        ...policyData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating retention policy:', error);
      throw new Error('Failed to update retention policy');
    }
  } catch (error) {
    console.error('Error updating retention policy:', error);
    throw new Error('Failed to update retention policy');
  }
}

export async function deleteRetentionPolicy(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from(POLICIES_COLLECTION)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting retention policy:', error);
      throw new Error('Failed to delete retention policy');
    }
  } catch (error) {
    console.error('Error deleting retention policy:', error);
    throw error;
  }
}

export async function cloneRetentionPolicy(id: string, newName: string): Promise<RetentionPolicy> {
  try {
    const { data: policyData, error: policyError } = await supabase
      .from(POLICIES_COLLECTION)
      .select('*')
      .eq('id', id)
      .single();
    
    if (policyError) {
      console.error('Error fetching original policy:', policyError);
      throw new Error('Failed to fetch original policy');
    }
    
    if (!policyData) {
      throw new Error('Original policy not found');
    }

    // Create new policy with cloned data
    const { data, error } = await supabase
      .from(POLICIES_COLLECTION)
      .insert([{
        ...policyData,
        name: newName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error cloning retention policy:', error);
      throw new Error('Failed to clone retention policy');
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      retentionYears: data.retentionyears,
      action: data.action,
      notifyBeforeAction: data.notifybeforeaction,
      notifyDaysBefore: data.notifydaysbefore,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  } catch (error) {
    console.error('Error cloning retention policy:', error);
    throw new Error('Failed to clone retention policy');
  }
}

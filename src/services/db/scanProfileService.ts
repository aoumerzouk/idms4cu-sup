import { supabase } from '../../lib/supabase';
import type { ScanProfile } from '../../types/scan';

const COLLECTION = 'scanProfiles';

export async function getScanProfiles(): Promise<ScanProfile[]> {
  const { data, error } = await supabase
    .from(COLLECTION)
    .select('*');
  
  if (error) {
    console.error('Error fetching scan profiles:', error);
    throw new Error('Failed to load scan profiles');
  }
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    sided: item.sided,
    color: item.color,
    format: item.format
  }));
}

export async function createScanProfile(
  profileData: Omit<ScanProfile, 'id'>
): Promise<ScanProfile> {
  const { data, error } = await supabase
    .from(COLLECTION)
    .insert([
      {
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating scan profile:', error);
    throw new Error('Failed to create scan profile');
  }
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    sided: data.sided,
    color: data.color,
    format: data.format
  };
}

export async function updateScanProfile(
  id: string,
  profileData: Partial<ScanProfile>
): Promise<void> {
  const { error } = await supabase
    .from(COLLECTION)
    .update({
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
  
  if (error) {
    console.error('Error updating scan profile:', error);
    throw new Error('Failed to update scan profile');
  }
}

export async function deleteScanProfile(id: string): Promise<void> {
  const { error } = await supabase
    .from(COLLECTION)
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting scan profile:', error);
    throw new Error('Failed to delete scan profile');
  }
}

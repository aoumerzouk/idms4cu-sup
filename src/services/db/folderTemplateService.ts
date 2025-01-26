import { supabase } from '../../lib/supabase';
import type { FolderTemplate } from '../../types/folder';

export async function saveFolderTemplates(
  entityType: 'member' | 'account',
  templates: FolderTemplate[]
): Promise<void> {
  const { error } = await supabase
    .from('settings')
    .upsert({
      id: `${entityType}FolderTemplates`,
      templates
    }, { onConflict: ['id'] });
  
  if (error) {
    console.error('Error saving folder templates:', error);
    throw new Error('Failed to save folder templates');
  }
}

export async function getFolderTemplates(
  entityType: 'member' | 'account'
): Promise<FolderTemplate[]> {
  const { data, error } = await supabase
    .from('settings')
    .select('templates')
    .eq('id', `${entityType}FolderTemplates`)
    .single();
  
  if (error) {
    console.error('Error fetching folder templates:', error);
    throw new Error('Failed to load folder templates');
  }
  
  return data?.templates || [];
}

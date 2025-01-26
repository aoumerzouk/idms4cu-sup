import { supabase } from '../../lib/supabase';

const SETTINGS_DOC = 'scanSettings';

export async function getScanFolder(): Promise<string | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('scanfolder')
    .eq('id', SETTINGS_DOC)
    .single();
  
  if (error) {
    console.error('Error fetching scan folder:', error);
    return null;
  }
  
  return data?.scanfolder || null;
}

export async function setScanFolder(path: string): Promise<void> {
  const { error } = await supabase
    .from('settings')
    .upsert({
      id: SETTINGS_DOC,
      scanfolder: path
    }, { onConflict: ['id'] });
  
  if (error) {
    console.error('Error setting scan folder:', error);
    throw new Error('Failed to set scan folder');
  }
}

import { supabase } from '../lib/supabase';
    import type { Folder } from '../types/folder';

    export async function getFolders(entityType: 'member' | 'account', entityId: string): Promise<Folder[]> {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('entitytype', entityType)
        .eq('entityid', entityId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching folders:', error);
        throw new Error('Failed to load folders');
      }
      
      return data.map(item => ({
        id: item.id,
        name: item.name,
        isOptional: item.isoptional,
        parentId: item.parentid,
        entityType: item.entitytype,
        entityId: item.entityid,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    }

    export async function createFolder(
      folderData: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<Folder> {
      const { data, error } = await supabase
        .from('folders')
        .insert([
          {
            name: folderData.name,
            isoptional: folderData.isOptional,
            entitytype: folderData.entityType,
            entityid: folderData.entityId,
            parentid: folderData.parentId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating folder:', error);
        throw new Error('Failed to create folder');
      }
      
      return {
        id: data.id,
        name: data.name,
        isOptional: data.isoptional,
        parentId: data.parentid,
        entityType: data.entitytype,
        entityId: data.entityid,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    }

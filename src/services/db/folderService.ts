import { supabase } from '../../lib/supabase';
import type { Folder } from '../../types/folder';
import { getFolderTemplates } from './folderTemplateService';

export async function createFoldersFromTemplate(entityType: 'member' | 'account', entityId: string) {
  try {
    // Get folder templates
    const templates = await getFolderTemplates(entityType);
    
    // Create folders collection for this entity
    const foldersToCreate: any[] = [];

    for (const template of templates) {
      foldersToCreate.push({
        id: `${template.id}_${entityId}`,
        name: template.name,
        isoptional: template.isOptional,
        entitytype: entityType,
        entityid: entityId,
        parentid: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // Create subfolders
      if (template.subfolders?.length) {
        for (const subfolder of template.subfolders) {
          foldersToCreate.push({
            id: `${subfolder.id}_${entityId}`,
            name: subfolder.name,
            isoptional: subfolder.isOptional,
            entitytype: entityType,
            entityid: entityId,
            parentid: `${template.id}_${entityId}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          if (subfolder.subfolders?.length) {
            for (const subSubfolder of subfolder.subfolders) {
              foldersToCreate.push({
                id: `${subSubfolder.id}_${entityId}`,
                name: subSubfolder.name,
                isoptional: subSubfolder.isOptional,
                entitytype: entityType,
                entityid: entityId,
                parentid: `${subfolder.id}_${entityId}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
            }
          }
        }
      }
    }

    const { error } = await supabase
      .from('folders')
      .insert(foldersToCreate);
    
    if (error) {
      console.error('Error creating folders:', error);
      throw new Error('Failed to create folders');
    }
  } catch (error) {
    console.error('Error creating folders from template:', error);
    throw error;
  }
}

export async function getFolders(entityType: 'member' | 'account', entityId: string): Promise<Folder[]> {
  try {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('entitytype', entityType)
      .eq('entityid', entityId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching folders:', error);
      return [];
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
  } catch (error) {
    console.error('Error fetching folders:', error);
    return [];
  }
}

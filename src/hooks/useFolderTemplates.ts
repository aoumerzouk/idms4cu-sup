import { useState, useEffect } from 'react';
import type { Folder } from '../types/folder';
import { getFolderTemplates } from '../services/db/folderTemplateService';

export function useFolderTemplates(entityType: 'member' | 'account', entityId: string | null) {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    if (!entityId) {
      setFolders([]);
      return;
    }

    // Get templates from database
    getFolderTemplates(entityType).then(templates => {
      const convertedFolders: Folder[] = [];

      const convertTemplate = (template: any, parentId: string | null = null) => {
        const folder: Folder = {
          id: `${template.id}_${entityId}`,
          name: template.name,
          isOptional: template.isOptional,
          parentId,
          entityType
        };
        convertedFolders.push(folder);

        template.subfolders?.forEach((subfolder: any) => {
          convertTemplate(subfolder, folder.id);
        });
      };

      templates.forEach(template => convertTemplate(template));
      setFolders(convertedFolders);
    });
  }, [entityType, entityId]);

  return folders;
}

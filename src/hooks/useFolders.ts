import { useState, useEffect } from 'react';
import type { Folder } from '../types/folder';
import * as folderService from '../services/folderService';

export function useFolders(entityType: 'member' | 'account', entityId: string | null) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (entityId) {
      loadFolders();
    }
  }, [entityType, entityId]);

  async function loadFolders() {
    if (!entityId) return;
    
    setLoading(true);
    try {
      const data = await folderService.getFolders(entityType, entityId);
      setFolders(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load folders'));
    } finally {
      setLoading(false);
    }
  }

  const addFolder = async (folderData: Omit<Folder, 'id' | 'created_at' | 'updated_at'>) => {
    const newFolder = await folderService.createFolder(folderData);
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  };

  return {
    folders,
    loading,
    error,
    addFolder,
    refresh: loadFolders
  };
}

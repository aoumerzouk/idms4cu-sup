import { useState, useEffect } from 'react';
import type { Document } from '../types/document';
import * as documentService from '../services/db/documentService';

export function useDocuments(folderId: string | null) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (folderId) {
      loadDocuments();
    }
  }, [folderId]);

  async function loadDocuments() {
    if (!folderId) return;
    
    setLoading(true);
    try {
      const data = await documentService.getDocuments(folderId);
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load documents'));
    } finally {
      setLoading(false);
    }
  }

  const addDocument = async (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDocument = await documentService.createDocument(documentData);
    setDocuments(prev => [newDocument, ...prev]);
    return newDocument;
  };

  return {
    documents,
    loading,
    error,
    addDocument,
    refresh: loadDocuments
  };
}

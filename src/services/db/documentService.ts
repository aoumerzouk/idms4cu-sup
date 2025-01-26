import { supabase } from '../../lib/supabase';
import type { Document } from '../../types/document';

const COLLECTION = 'documents';

export async function getDocuments(folderId: string): Promise<Document[]> {
  const { data, error } = await supabase
    .from(COLLECTION)
    .select('*')
    .eq('folderid', folderId)
    .order('createdate', { ascending: false });
  
  if (error) {
    console.error('Error fetching documents:', error);
    throw new Error('Failed to load documents');
  }
  
  return data.map(item => ({
    id: item.id,
    title: item.title,
    type: item.type,
    size: item.size,
    createdAt: new Date(item.createdate),
    indexDate: item.indexdate ? new Date(item.indexdate) : undefined,
    createdBy: item.userid,
    tags: item.tags,
    retentionPolicyId: item.retention,
    retentionExpiryDate: item.retentionExpiryDate ? new Date(item.retentionExpiryDate) : undefined,
    status: item.status,
    updatedAt: item.updatedat ? new Date(item.updatedat) : undefined
  }));
}

export async function createDocument(
  documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Document> {
  const { data, error } = await supabase
    .from(COLLECTION)
    .insert([
      {
        title: documentData.title,
        type: documentData.type,
        size: documentData.size,
        createdate: new Date().toISOString(),
        indexdate: documentData.indexDate?.toISOString(),
        tags: documentData.tags,
        status: documentData.status,
        folderid: documentData.folderId,
        workflow: documentData.workflow,
        url: documentData.url,
        retention: documentData.retentionPolicyId,
        catid: documentData.catid,
        userid: documentData.createdBy,
        updatedat: new Date().toISOString()
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating document:', error);
    throw new Error('Failed to create document');
  }
  
  return {
    id: data.id,
    title: data.title,
    type: data.type,
    size: data.size,
    createdAt: new Date(data.createdate),
    indexDate: data.indexdate ? new Date(data.indexdate) : undefined,
    createdBy: data.userid,
    tags: data.tags,
    retentionPolicyId: data.retention,
    retentionExpiryDate: data.retentionExpiryDate ? new Date(data.retentionExpiryDate) : undefined,
    status: data.status,
    updatedAt: data.updatedat ? new Date(data.updatedat) : undefined
  };
}

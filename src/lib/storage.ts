import { getStorage, ref as storageRef } from 'firebase/storage';
import { app } from './firebase';

export const storage = getStorage(app);

export function getDocumentStorageRef(folderId: string, documentId: string, fileName: string) {
  return storageRef(storage, `documents/${folderId}/${documentId}/${fileName}`);
}

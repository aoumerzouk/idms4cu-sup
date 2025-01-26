import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { storage } from '../../lib/firebase/storage';
import { firestore } from '../../lib/firebase/firestore';
import type { MemberIdentifier, AccountIdentifier } from '../../types/creditUnion';

export async function uploadDocument(
  file: File,
  metadata: {
    title: string;
    tags: string[];
  },
  entity: MemberIdentifier | AccountIdentifier
) {
  try {
    // Create a reference to the storage location
    const entityType = 'memberNumber' in entity ? 'members' : 'accounts';
    const entityId = entity.id;
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const storageRef = ref(
      storage,
      `documents/${entityType}/${entityId}/${timestamp}.${fileExtension}`
    );

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Create document record in Firestore
    const docData = {
      title: metadata.title,
      type: fileExtension?.toLowerCase() || 'unknown',
      size: file.size,
      url: downloadURL,
      entityType,
      entityId,
      tags: metadata.tags,
      status: 'pending',
      createdAt: Timestamp.now(),
      lastModified: Timestamp.now()
    };

    await addDoc(collection(firestore, 'documents'), docData);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw new Error('Failed to upload document');
  }
}

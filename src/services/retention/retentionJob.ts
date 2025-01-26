import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { 
  isDocumentExpired, 
  getDocumentLifecycleStatus 
} from './documentLifecycle';
import type { Document } from '../../types/document';
import type { RetentionPolicy } from '../../types/retention';

/**
 * Process documents that have reached their retention period
 */
export async function processExpiredDocuments() {
  const documentsRef = collection(firestore, 'documents');
  const policiesRef = collection(firestore, 'retentionPolicies');

  // Get all active documents with retention policies
  const q = query(
    documentsRef,
    where('status', '==', 'active'),
    where('retentionPolicyId', '!=', null)
  );

  const snapshot = await getDocs(q);
  const documents = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Document));

  // Get all retention policies
  const policiesSnapshot = await getDocs(policiesRef);
  const policies = new Map<string, RetentionPolicy>();
  policiesSnapshot.docs.forEach(doc => {
    policies.set(doc.id, { id: doc.id, ...doc.data() } as RetentionPolicy);
  });

  // Process each document
  for (const document of documents) {
    if (!document.retentionPolicyId) continue;
    
    const policy = policies.get(document.retentionPolicyId);
    if (!policy) continue;

    if (isDocumentExpired(document)) {
      const newStatus = getDocumentLifecycleStatus(document, policy);
      
      if (newStatus !== document.status) {
        await updateDoc(doc(documentsRef, document.id), {
          status: newStatus,
          updatedAt: new Date()
        });
      }
    }
  }
}

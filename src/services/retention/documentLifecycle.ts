import { Timestamp } from 'firebase/firestore';
import type { Document } from '../../types/document';
import type { RetentionPolicy } from '../../types/retention';

export function calculateRetentionExpiry(
  indexDate: Date,
  retentionPeriod: number
): Date {
  const expiryDate = new Date(indexDate);
  expiryDate.setDate(expiryDate.getDate() + retentionPeriod);
  return expiryDate;
}

export function isDocumentExpired(document: Document): boolean {
  if (!document.retentionExpiryDate) return false;
  return new Date() > document.retentionExpiryDate;
}

export function shouldNotifyForDocument(
  document: Document,
  policy: RetentionPolicy
): boolean {
  if (!document.retentionExpiryDate || !policy.notifyBeforeAction) return false;
  
  const now = new Date();
  const notifyDate = new Date(document.retentionExpiryDate);
  notifyDate.setDate(notifyDate.getDate() - (policy.notifyDaysBefore || 0));
  
  return now >= notifyDate && now < document.retentionExpiryDate;
}

export function getDocumentLifecycleStatus(
  document: Document,
  policy?: RetentionPolicy
): Document['status'] {
  if (!policy || !document.retentionExpiryDate) {
    return document.status;
  }

  if (isDocumentExpired(document)) {
    switch (policy.action) {
      case 'delete':
        return 'deleted';
      case 'archive':
        return 'archived';
      case 'review':
        return 'expired';
      default:
        return document.status;
    }
  }

  return document.status;
}

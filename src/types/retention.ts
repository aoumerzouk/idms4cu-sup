export type RetentionAction = 
  /**
   * Document requires manual review before final disposition.
   * Staff must evaluate if document should be kept, archived, or deleted.
   */
  | 'review'
  
  /**
   * Document will be automatically moved to long-term storage.
   * Still retrievable but optimized for infrequent access.
   */
  | 'archive'
  
  /**
   * Document will be permanently deleted after retention period.
   * No recovery possible after deletion.
   */
  | 'delete';

export interface RetentionPolicy {
  id: string;
  name: string;
  description?: string;
  // Duration in years
  retentionYears: number;
  action: RetentionAction;
  // Whether to notify before taking action
  notifyBeforeAction: boolean;
  // Days before action to notify
  notifyDaysBefore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentRetention {
  id: string;
  documentId: string;
  policyId: string;
  // When the document was added to SIAM
  indexDate: Date;
  // Calculated date when action should be taken
  actionDate: Date;
  // Whether notification has been sent
  notificationSent: boolean;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

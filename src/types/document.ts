export interface Document {
  id: string;
  title: string;
  type: string;
  size: number;
  // When document was created/uploaded
  createdAt: Date;
  // When document was indexed in SIAM
  indexDate: Date;
  createdBy: string;
  tags: string[];
  // Associated retention policy
  retentionPolicyId?: string;
  // Calculated date when retention period expires
  retentionExpiryDate?: Date;
  status: DocumentStatus;
}

export type DocumentStatus = 
  | 'active'     // Document is available and accessible
  | 'pending'    // Awaiting review/approval
  | 'archived'   // Moved to long-term storage
  | 'expired'    // Retention period expired, awaiting action
  | 'deleted';   // Marked for deletion

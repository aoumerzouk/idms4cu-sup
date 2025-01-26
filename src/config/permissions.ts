export const DEFAULT_PERMISSIONS = {
  ADMIN: 'ADMIN',
  SCAN_DOCUMENTS: 'SCAN_DOCUMENTS',
  VIEW_DOCUMENTS: 'VIEW_DOCUMENTS',
  CREATE_DOCUMENTS: 'CREATE_DOCUMENTS',
  DELETE_DOCUMENTS: 'DELETE_DOCUMENTS',
  APPROVE_DOCUMENTS: 'APPROVE_DOCUMENTS',
  REVIEW_DOCUMENTS: 'REVIEW_DOCUMENTS',
  REJECT_DOCUMENTS: 'REJECT_DOCUMENTS'
} as const;

export const DEFAULT_ROLES = {
  admin: {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access',
    permissions: Object.values(DEFAULT_PERMISSIONS)
  },
  document_manager: {
    id: 'document_manager',
    name: 'Document Manager',
    description: 'Can manage all document operations',
    permissions: [
      DEFAULT_PERMISSIONS.SCAN_DOCUMENTS,
      DEFAULT_PERMISSIONS.VIEW_DOCUMENTS,
      DEFAULT_PERMISSIONS.CREATE_DOCUMENTS,
      DEFAULT_PERMISSIONS.APPROVE_DOCUMENTS,
      DEFAULT_PERMISSIONS.REVIEW_DOCUMENTS
    ]
  },
  document_viewer: {
    id: 'document_viewer',
    name: 'Document Viewer',
    description: 'Can only view documents',
    permissions: [
      DEFAULT_PERMISSIONS.VIEW_DOCUMENTS
    ]
  }
};

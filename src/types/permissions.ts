export type Permission = 
  | 'ADMIN'
  | 'SCAN_DOCUMENTS'
  | 'VIEW_DOCUMENTS'
  | 'CREATE_DOCUMENTS'
  | 'DELETE_DOCUMENTS'
  | 'APPROVE_DOCUMENTS'
  | 'REVIEW_DOCUMENTS'
  | 'REJECT_DOCUMENTS';

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
};

export type UserRole = {
  userId: string;
  roleId: string;
  assignedAt: string;
};

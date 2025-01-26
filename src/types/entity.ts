export type EntityType = 'member' | 'account';

export interface Member {
  id: string;
  memberNumber: string;
  name: string;
  joinDate: Date;
}

export interface Account {
  id: string;
  accountNumber: string;
  type: 'checking' | 'savings' | 'loan' | 'certificate';
  memberIds: string[];
}

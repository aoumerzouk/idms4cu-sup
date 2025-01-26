// Core Credit Union types
export type MemberIdentifier = {
  id: string;
  memberNumber: string;
  displayName: string;
};

export type AccountIdentifier = {
  id: string;
  accountNumber: string;
  type: AccountType;
  displayName: string;
};

export type AccountType = 'checking' | 'savings' | 'loan' | 'certificate' | 'other';

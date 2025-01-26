export interface Account {
  id: string;
  accountNumber: {
    base: string;      // Account
    typeCode: string;  // Code
    suffix: string;    // Suffix
  };
  type: AccountType;
  status: AccountStatus;
  dateOpened: Date;
  memberIds: string[];
  balance: number;
}

export type AccountType = 
  | 'share'     // Regular savings
  | 'draft'     // Checking
  | 'certificate' // Certificate of deposit
  | 'moneyMarket'
  | 'loan'
  | 'lineOfCredit';

export type AccountStatus = 'active' | 'closed' | 'frozen';

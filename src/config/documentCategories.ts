export const DOCUMENT_CATEGORIES = [
      'Member Documents',
      'Account Documents',
      'Loan Documents',
      'Collateral Documents',
      'Collections',
      'Operations',
      'Accounting',
      'Board',
      'Human Resources',
      'Receipts',
      'Reports',
      'Statements'
    ] as const;

    export type DocumentCategory = typeof DOCUMENT_CATEGORIES[number];

export interface DocumentIndex {
      indexLabel: string;
      type: 'nschar' | 'char' | 'datetime';
      size: number;
      description: string;
    }

    export interface DocumentCategory {
      name: string;
      indexes: DocumentIndex[];
    }

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

    export type DocumentCategoryName = typeof DOCUMENT_CATEGORIES[number];

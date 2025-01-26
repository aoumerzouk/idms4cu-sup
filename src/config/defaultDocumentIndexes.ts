import type { DocumentCategory } from '../types/documentCategory';

    export const DEFAULT_DOCUMENT_CATEGORIES: DocumentCategory[] = [
      {
        name: 'Member Documents',
        indexes: [
          {
            indexLabel: 'memname',
            type: 'nschar',
            size: 80,
            description: 'Member Name'
          },
          {
            indexLabel: 'memnumber',
            type: 'nschar',
            size: 10,
            description: 'Member Number'
          },
          {
            indexLabel: 'mssnum',
            type: 'nschar',
            size: 11,
            description: 'Social Security number'
          }
        ]
      },
      {
        name: 'Account Documents',
        indexes: [
          {
            indexLabel: 'accountcode',
            type: 'nschar',
            size: 40,
            description: 'Account Code'
          },
          {
            indexLabel: 'accountnumber',
            type: 'nschar',
            size: 40,
            description: 'Account Number'
          },
          {
            indexLabel: 'accountsuffix',
            type: 'nschar',
            size: 10,
            description: 'Account Suffix'
          }
        ]
      },
      {
        name: 'Loan Documents',
        indexes: [
          {
            indexLabel: 'loanid',
            type: 'nschar',
            size: 10,
            description: 'Loan ID'
          },
          {
            indexLabel: 'loantype',
            type: 'nschar',
            size: 50,
            description: 'Loan Type'
          }
        ]
      },
      {
        name: 'Collateral Documents',
        indexes: []
      },
      {
        name: 'Collections',
        indexes: []
      },
      {
        name: 'Operations',
        indexes: []
      },
      {
        name: 'Accounting',
        indexes: [
          {
            indexLabel: 'amnt',
            type: 'nschar',
            size: 24,
            description: 'Amount'
          }
        ]
      },
      {
        name: 'Board',
        indexes: []
      },
      {
        name: 'Human Resources',
        indexes: []
      },
      {
        name: 'Receipts',
        indexes: [
          {
            indexLabel: 'tellerid',
            type: 'nschar',
            size: 50,
            description: 'Teller Id'
          }
        ]
      },
      {
        name: 'Reports',
        indexes: [
          {
            indexLabel: 'createdate',
            type: 'datetime',
            size: 50,
            description: 'Created Date'
          }
        ]
      },
      {
        name: 'Statements',
        indexes: [
          {
            indexLabel: 'lcdate',
            type: 'datetime',
            size: 50,
            description: 'Life Cycle Date'
          }
        ]
      }
    ];

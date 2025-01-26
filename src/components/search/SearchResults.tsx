import React from 'react';
import { User, CreditCard } from 'lucide-react';
import type { Member } from '../../types/member';
import type { Account } from '../../types/account';
import { generateAccountNumber } from '../../utils/accountUtils';

interface SearchResultsProps {
  results: Array<{
    type: 'member' | 'account';
    item: Member | Account;
  }>;
  onSelectMember: (member: Member) => void;
  onSelectAccount: (account: Account) => void;
  selectedId?: string;
}

export default function SearchResults({ 
  results, 
  onSelectMember, 
  onSelectAccount,
  selectedId 
}: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-md shadow-lg p-4">
        <p className="text-center text-gray-400">No results found</p>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-md shadow-lg overflow-hidden max-h-64 overflow-y-auto z-50">
      {results.map((result) => {
        if (result.type === 'member') {
          const member = result.item as Member;
          return (
            <button
              key={`member-${member.id}`}
              onClick={() => onSelectMember(member)}
              className={`w-full flex items-center gap-3 p-3 hover:bg-gray-700 text-left transition-colors
                ${selectedId === member.id ? 'bg-gray-700' : ''}`}
            >
              <User className="w-5 h-5 text-blue-400" />
              <div>
                <div className="font-medium text-white">
                  {member.firstName} {member.lastName}
                </div>
                <div className="text-sm text-gray-400">
                  Member #{member.memberNumber}
                </div>
              </div>
            </button>
          );
        } else {
          const account = result.item as Account;
          const accountNumber = generateAccountNumber(
            account.accountNumber.base,
            account.accountNumber.typeCode,
            account.accountNumber.suffix
          );
          return (
            <button
              key={`account-${account.id}`}
              onClick={() => onSelectAccount(account)}
              className={`w-full flex items-center gap-3 p-3 hover:bg-gray-700 text-left transition-colors
                ${selectedId === account.id ? 'bg-gray-700' : ''}`}
            >
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="font-medium text-white">
                  {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account
                </div>
                <div className="text-sm text-gray-400">
                  #{accountNumber}
                </div>
              </div>
            </button>
          );
        }
      })}
    </div>
  );
}

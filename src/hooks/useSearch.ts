import { useState, useMemo } from 'react';
import type { Member } from '../types/member';
import type { Account } from '../types/account';
import { generateAccountNumber } from '../utils/accountUtils';

interface SearchResult {
  type: 'member' | 'account';
  item: Member | Account;
  matchScore: number;
}

export function useSearch(members: Member[] = [], accounts: Account[] = []) {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Search members
    members.forEach(member => {
      if (!member) return;
      
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      const memberNumber = member.memberNumber?.toLowerCase() || '';
      
      if (fullName.includes(term) || memberNumber.includes(term)) {
        results.push({
          type: 'member',
          item: member,
          matchScore: fullName.startsWith(term) ? 2 : 1
        });
      }
    });

    // Search accounts
    accounts.forEach(account => {
      if (!account?.accountNumber) return;
      
      const accountNum = generateAccountNumber(
        account.accountNumber.base,
        account.accountNumber.typeCode,
        account.accountNumber.suffix
      );
      
      // Search both the full account number and individual parts
      const searchableFields = [
        accountNum.toLowerCase(),
        account.accountNumber.base.toLowerCase(),
        account.accountNumber.typeCode.toLowerCase(),
        account.accountNumber.suffix.toLowerCase()
      ];
      
      if (searchableFields.some(field => field.includes(term))) {
        results.push({
          type: 'account',
          item: account,
          matchScore: accountNum.toLowerCase().startsWith(term) ? 2 : 1
        });
      }
    });

    return results.sort((a, b) => b.matchScore - a.matchScore);
  }, [searchTerm, members, accounts]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults: searchResults.map(result => ({
      type: result.type,
      item: result.item
    }))
  };
}

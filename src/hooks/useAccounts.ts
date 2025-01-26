import { useState, useEffect } from 'react';
import type { Account } from '../types/account';
import type { AccountIdentifier } from '../types/creditUnion';
import * as accountService from '../services/db/accountService';
import { generateAccountNumber } from '../utils/accountUtils';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    try {
      const data = await accountService.getAccounts();
      setAccounts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load accounts'));
    } finally {
      setLoading(false);
    }
  }

  const addAccount = async (accountData: Omit<Account, 'id' | 'dateOpened'>, memberId: string) => {
    const newAccount = await accountService.createAccount(accountData, memberId);
    setAccounts(prev => [newAccount, ...prev]);
    return newAccount;
  };

  const getAccountIdentifier = (account: Account): AccountIdentifier => ({
    id: account.id,
    accountNumber: generateAccountNumber(
      account.accountNumber.base,
      account.accountNumber.typeCode,
      account.accountNumber.suffix
    ),
    type: account.type,
    displayName: `${account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account`,
  });

  const getMemberAccounts = (memberId: string) => {
    return accounts.filter(account => 
      account.memberIds.includes(memberId)
    );
  };

  return {
    accounts,
    loading,
    error,
    addAccount,
    getAccountIdentifier,
    getMemberAccounts,
    refresh: loadAccounts
  };
}

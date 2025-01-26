import React from 'react';
    import { CreditCard, Plus } from 'lucide-react';
    import { useAccounts } from '../../hooks/useAccounts';
    import LoadingSpinner from '../LoadingSpinner';
    import type { AccountIdentifier } from '../../types/creditUnion';
    import { generateAccountNumber } from '../../utils/accountUtils';
    import AccountFormModal from '../modals/AccountFormModal';
    import type { Account } from '../../types/account';

    interface MemberAccountsProps {
      memberId: string;
      onSelectAccount: (account: AccountIdentifier) => void;
    }

    export default function MemberAccounts({ memberId, onSelectAccount }: MemberAccountsProps) {
      const { accounts, loading, error, getMemberAccounts, getAccountIdentifier, addAccount } = useAccounts();
      const memberAccounts = getMemberAccounts(memberId);
      const [isAccountModalOpen, setIsAccountModalOpen] = React.useState(false);

      const handleCreateAccount = async (accountData: Omit<Account, 'id' | 'dateOpened'>) => {
        try {
          await addAccount(accountData, memberId);
          setIsAccountModalOpen(false);
        } catch (error) {
          console.error('Error creating account:', error);
          alert('Failed to create account');
        }
      };

      if (loading) return <LoadingSpinner />;
      if (error) return <div className="text-red-500">Error loading accounts: {error.message}</div>;

      console.log('Member Accounts:', memberAccounts);

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Member Accounts</h3>
            <button
              onClick={() => setIsAccountModalOpen(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </button>
          </div>

          {memberAccounts.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No accounts found</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {memberAccounts.map(account => (
                <button
                  key={account.id}
                  onClick={() => onSelectAccount(getAccountIdentifier(account))}
                  className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors text-left"
                >
                  <div className="bg-blue-100 p-2 rounded-full">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account
                    </h4>
                    <p className="text-sm text-gray-500">
                      #{generateAccountNumber(
                        account.accountNumber.base,
                        account.accountNumber.typeCode,
                        account.accountNumber.suffix
                      )}
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      Balance: ${account.balance.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
          <AccountFormModal
            isOpen={isAccountModalOpen}
            onClose={() => setIsAccountModalOpen(false)}
            onSubmit={handleCreateAccount}
            members={[]}
            memberId={memberId}
          />
        </div>
      );
    }

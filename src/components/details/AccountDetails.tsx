import React from 'react';
import { CreditCard, Calendar, Users, ArrowLeft } from 'lucide-react';
import type { Account } from '../../types/account';
import type { MemberIdentifier } from '../../types/creditUnion';
import { generateAccountNumber } from '../../utils/accountUtils';
import { useMembers } from '../../hooks/useMembers';

interface AccountDetailsProps {
  account: Account;
  onEntitySelect: (entity: MemberIdentifier) => void;
}

export default function AccountDetails({ account, onEntitySelect }: AccountDetailsProps) {
  const { members, getMemberIdentifier } = useMembers();
  const accountHolder = members.find(m => m.id === account.memberIds[0]);
  const fullAccountNumber = generateAccountNumber(
    account.accountNumber.base,
    account.accountNumber.typeCode,
    account.accountNumber.suffix
  );

  const handleBackToMember = () => {
    if (accountHolder) {
      onEntitySelect(getMemberIdentifier(accountHolder));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {accountHolder && (
        <button
          onClick={handleBackToMember}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to {accountHolder.firstName} {accountHolder.lastName}
        </button>
      )}

      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold">
          {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account
        </h2>
        <p className="text-gray-500">#{fullAccountNumber}</p>
        <span className={`inline-block mt-2 px-2 py-1 text-sm rounded-full
          ${account.status === 'active' ? 'bg-green-100 text-green-800' : 
            account.status === 'closed' ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'}`}>
          {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Account Information</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <CreditCard className="w-4 h-4" />
              <span>Current Balance: ${account.balance.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Opened: {new Date(account.dateOpened).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>Joint Account: {account.memberIds.length > 1 ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

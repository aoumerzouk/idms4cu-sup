import React from 'react';
import type { MemberIdentifier, AccountIdentifier } from '../../types/creditUnion';
import MemberDetails from './MemberDetails';
import AccountDetails from './AccountDetails';
import { useMembers } from '../../hooks/useMembers';
import { useAccounts } from '../../hooks/useAccounts';
import { Loader2 } from 'lucide-react';

interface EntityDetailsProps {
  selectedEntity: MemberIdentifier | AccountIdentifier | null;
  onEntitySelect: (entity: MemberIdentifier | AccountIdentifier) => void;
}

export default function EntityDetails({ selectedEntity, onEntitySelect }: EntityDetailsProps) {
  const { members, loading: membersLoading } = useMembers();
  const { accounts, loading: accountsLoading } = useAccounts();

  if (!selectedEntity) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center text-gray-500">
        Select a member or account to view details
      </div>
    );
  }

  if (membersLoading || accountsLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if ('memberNumber' in selectedEntity) {
    const member = members.find(m => m.id === selectedEntity.id);
    if (!member) return null;
    return <MemberDetails member={member} />;
  } else {
    const account = accounts.find(a => a.id === selectedEntity.id);
    if (!account) return null;
    return <AccountDetails account={account} onEntitySelect={onEntitySelect} />;
  }
}

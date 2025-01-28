import React, { useState } from 'react';
import Modal from './Modal';
import AccountForm from '../account/AccountForm';
import type { Account } from '../../types/account';
import type { Member } from '../../types/member';
import MemberSelector from '../member/MemberSelector';
import { useMembers } from '../../hooks/useMembers';

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (account: Omit<Account, 'id' | 'dateOpened'>, memberId: string) => void;
  memberId?: string;
}

export default function AccountFormModal({ isOpen, onClose, onSubmit, memberId }: AccountFormModalProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(memberId || null);
  const { members, loading, error } = useMembers();

  const handleAccountSubmit = (accountData: Omit<Account, 'id' | 'dateOpened'>) => {
    if (selectedMemberId) {
      onSubmit(accountData, selectedMemberId);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Account"
    >
      <div className="space-y-6">
        {memberId ? (
          <AccountForm
            memberId={memberId}
            onSubmit={handleAccountSubmit}
          />
        ) : (
          <>
            <MemberSelector
              members={members}
              loading={loading}
              error={error}
              selectedMemberId={selectedMemberId || ''}
              onSelect={setSelectedMemberId}
            />
            {selectedMemberId && (
              <AccountForm
                memberId={selectedMemberId}
                onSubmit={handleAccountSubmit}
              />
            )}
          </>
        )}
      </div>
    </Modal>
  );
}

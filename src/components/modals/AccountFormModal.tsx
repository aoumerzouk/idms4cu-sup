import React from 'react';
    import Modal from './Modal';
    import AccountForm from '../account/AccountForm';
    import type { Account } from '../../types/account';
    import type { Member } from '../../types/member';

    interface AccountFormModalProps {
      isOpen: boolean;
      onClose: () => void;
      onSubmit: (account: Omit<Account, 'id' | 'dateOpened'>) => void;
      members: Member[];
      memberId: string;
    }

    export default function AccountFormModal({ isOpen, onClose, onSubmit, memberId }: AccountFormModalProps) {
      return (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          title="Create New Account"
        >
          <div className="space-y-6">
            <AccountForm
              memberId={memberId}
              onSubmit={onSubmit}
            />
          </div>
        </Modal>
      );
    }

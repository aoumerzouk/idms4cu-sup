import React, { useState } from 'react';
import Modal from './Modal';
import MemberForm from '../member/MemberForm';
import AccountForm from '../account/AccountForm';
import type { Member } from '../../types/member';
import type { Account } from '../../types/account';

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (member: Omit<Member, 'id' | 'dateJoined'>, accounts: Omit<Account, 'id' | 'dateOpened'>[]) => void;
}

export default function MemberFormModal({ isOpen, onClose, onSubmit }: MemberFormModalProps) {
  const [step, setStep] = useState<'member' | 'accounts'>('member');
  const [memberData, setMemberData] = useState<Omit<Member, 'id' | 'dateJoined'> | null>(null);
  const [accounts, setAccounts] = useState<Omit<Account, 'id' | 'dateOpened'>[]>([]);

  const handleMemberSubmit = (data: Omit<Member, 'id' | 'dateJoined'>) => {
    setMemberData(data);
    setStep('accounts');
  };

  const handleAccountSubmit = (account: Omit<Account, 'id' | 'dateOpened'>) => {
    setAccounts([...accounts, account]);
  };

  const handleFinish = () => {
    if (memberData) {
      onSubmit(memberData, accounts);
      setStep('member');
      setMemberData(null);
      setAccounts([]);
    }
  };

  const handleClose = () => {
    setStep('member');
    setMemberData(null);
    setAccounts([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'member' ? 'Create New Member' : 'Add Member Accounts'}
    >
      {step === 'member' ? (
        <MemberForm onSubmit={handleMemberSubmit} />
      ) : (
        <div>
          <div className="space-y-4">
            {accounts.map((account, index) => (
              <div key={index} className="p-3 bg-gray-700 rounded-md">
                <div className="font-medium">{account.type} Account</div>
                <div className="text-sm text-gray-300">
                  Balance: ${account.balance.toFixed(2)}
                </div>
              </div>
            ))}
            <AccountForm
              memberId={memberData?.id || ''}
              onSubmit={handleAccountSubmit}
            />
          </div>
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep('member')}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Back
            </button>
            <button
              onClick={handleFinish}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              {accounts.length > 0 ? 'Create Member & Accounts' : 'Skip Account Creation'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

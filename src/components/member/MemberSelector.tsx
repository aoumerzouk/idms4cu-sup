import React from 'react';
import { User } from 'lucide-react';
import type { Member } from '../../types/member';

interface MemberSelectorProps {
  members: Member[];
  selectedMemberId: string;
  onSelect: (memberId: string) => void;
}

export default function MemberSelector({ members, selectedMemberId, onSelect }: MemberSelectorProps) {
  if (members.length === 0) {
    return (
      <div className="text-center text-gray-400 py-4">
        No members found. Create a member first before adding accounts.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">Select Member</label>
      <div className="space-y-2">
        {members.map((member) => (
          <button
            key={member.id}
            onClick={() => onSelect(member.id)}
            className={`w-full flex items-center gap-3 p-2 rounded-md text-left
              ${selectedMemberId === member.id ? 'bg-emerald-600' : 'hover:bg-gray-700'}`}
          >
            <User className="w-5 h-5" />
            <div>
              <div className="font-medium">
                {member.firstName} {member.lastName}
              </div>
              <div className="text-sm text-gray-300">
                #{member.memberNumber}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

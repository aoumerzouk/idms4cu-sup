import React from 'react';
import { User } from 'lucide-react';
import type { Member } from '../../types/member';
import type { MemberIdentifier } from '../../types/creditUnion';
import LoadingSpinner from '../LoadingSpinner';

interface MemberListProps {
  members: Member[];
  loading: boolean;
  error: Error | null;
  onSelectMember: (identifier: MemberIdentifier) => void;
  getMemberIdentifier: (member: Member) => MemberIdentifier;
}

export default function MemberList({ 
  members, 
  loading, 
  error,
  onSelectMember, 
  getMemberIdentifier 
}: MemberListProps) {
  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to load members: {error.message}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center text-gray-400 py-4">
        No members found. Create a new member to get started.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <button
          key={member.id}
          onClick={() => onSelectMember(getMemberIdentifier(member))}
          className="w-full flex items-center gap-3 p-2 hover:bg-gray-800 rounded-md text-left"
        >
          <User className="w-5 h-5 text-gray-400" />
          <div>
            <div className="font-medium">
              {member.first_name} {member.last_name}
            </div>
            <div className="text-sm text-gray-400">
              #{member.member_number}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

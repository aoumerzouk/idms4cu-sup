import { useState, useEffect } from 'react';
import type { Member } from '../types/member';
import type { MemberIdentifier } from '../types/creditUnion';
import * as memberService from '../services/db/memberService';

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    try {
      const data = await memberService.getMembers();
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load members'));
    } finally {
      setLoading(false);
    }
  }

  const addMember = async (memberData: Omit<Member, 'id' | 'dateJoined'>) => {
    const newMember = await memberService.createMember(memberData);
    setMembers(prev => [newMember, ...prev]);
    return newMember;
  };

  const updateMember = async (id: string, memberData: Partial<Member>) => {
    const updatedMember = await memberService.updateMember(id, memberData);
    setMembers(prev => prev.map(member => 
      member.id === id ? { ...member, ...updatedMember } : member
    ));
    return updatedMember;
  };

  const getMemberIdentifier = (member: Member): MemberIdentifier => ({
    id: member.id,
    memberNumber: member.memberNumber,
    displayName: `${member.firstName} ${member.lastName}`,
  });

  return {
    members,
    loading,
    error,
    addMember,
    updateMember,
    getMemberIdentifier,
    refresh: loadMembers
  };
}

import { supabase } from '../lib/supabase';
    import type { Member } from '../types/member';
    import { generateMemberNumber } from '../utils/memberUtils';

    export async function getMembers(): Promise<Member[]> {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('datejoined', { ascending: false });
      
      if (error) {
        console.error('Error fetching members:', error);
        throw new Error('Failed to load members');
      }
      
      return data.map(item => ({
        id: item.id,
        firstName: item.firstname,
        lastName: item.lastname,
        memberNumber: item.membernumber,
        email: item.email,
        phone: item.phone,
        address: item.address,
        dateJoined: new Date(item.datejoined),
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    }

    export async function createMember(memberData: Omit<Member, 'id' | 'dateJoined'>): Promise<Member> {
      const { data, error } = await supabase
        .from('members')
        .insert([
          {
            ...memberData,
            membernumber: generateMemberNumber(),
            datejoined: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating member:', error);
        throw new Error('Failed to create member');
      }
      
      return {
        id: data.id,
        firstName: data.firstname,
        lastName: data.lastname,
        memberNumber: data.membernumber,
        email: data.email,
        phone: data.phone,
        address: data.address,
        dateJoined: new Date(data.datejoined),
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    }

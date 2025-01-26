import { supabase } from '../../lib/supabase';
import type { Member } from '../../types/member';
import { generateMemberNumber } from '../../utils/memberUtils';
import { v4 as uuidv4 } from 'uuid';

export async function getMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('customer')
    .select('*')
    .order('CreatedDate', { ascending: false });
  
  if (error) {
    console.error('Error fetching members:', error);
    throw new Error('Failed to load members');
  }
  
  return data.map(item => ({
    id: item.CustomerID,
    firstName: item.FirstName,
    lastName: item.LastName,
    memberNumber: item.CustomerNumber,
    email: item.Email,
    dateJoined: new Date(item.CreatedDate),
    middleName: item.MiddleName,
    SSN: item.SSN
  }));
}

export async function createMember(memberData: Omit<Member, 'id' | 'dateJoined'>): Promise<Member> {
  const newCustomerId = uuidv4();
  const { data, error } = await supabase
    .from('customer')
    .insert([
      {
        CustomerID: newCustomerId,
        CustomerNumber: generateMemberNumber(),
        CompanyName: memberData.CompanyName,
        FirstName: memberData.firstName,
        MiddleName: memberData.middleName,
        LastName: memberData.lastName,
        SSN: memberData.SSN,
        OtherID: memberData.OtherID,
        OtherIDType: memberData.OtherIDType,
        BirthDate: memberData.BirthDate?.toISOString(),
        Email: memberData.email[0],
        ExternalID: memberData.ExternalID,
        Photo: memberData.Photo,
        AddressID: memberData.AddressID,
        PhotoType: memberData.PhotoType,
        CreatedDate: new Date().toISOString(),
        UpdatedDate: new Date().toISOString()
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating member:', error);
    throw new Error('Failed to create member');
  }
  
  return {
    id: data.CustomerID,
    firstName: data.FirstName,
    lastName: data.LastName,
    memberNumber: data.CustomerNumber,
    email: data.Email,
    dateJoined: new Date(data.CreatedDate),
    middleName: data.MiddleName,
    SSN: data.SSN
  };
}

import { supabase } from '../../lib/supabase';
import type { Account } from '../../types/account';
import { createFoldersFromTemplate } from './folderService';
import { generateAccountNumber } from '../../utils/accountUtils';
import { v4 as uuidv4 } from 'uuid';

export async function getAccounts(): Promise<Account[]> {
  try {
    const { data, error } = await supabase
      .from('account')
      .select('*')
      .order('Opened', { ascending: false });
    
    if (error) {
      console.error('Error fetching accounts:', error);
      throw new Error('Failed to load accounts');
    }
    
    return data.map(item => ({
      id: item.AccountID,
      accountNumber: {
        base: item.Number,
        typeCode: item.Code,
        suffix: item.Suffix
      },
      type: item.type,
      status: item.Status,
      dateOpened: new Date(item.Opened),
      memberIds: item.memberIds,
      balance: item.Balance
    }));
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return [];
  }
}

export async function createAccount(
  accountData: Omit<Account, 'id' | 'dateOpened'>,
  memberId: string
): Promise<Account> {
  try {
    // Check if account number combination already exists
    const fullAccountNumber = generateAccountNumber(
      accountData.accountNumber.base,
      accountData.accountNumber.typeCode,
      accountData.accountNumber.suffix
    );
    
    const { data: existingAccounts, error: existingAccountError } = await supabase
      .from('account')
      .select('AccountID')
      .eq('Number', accountData.accountNumber.base)
      .eq('Code', accountData.accountNumber.typeCode)
      .eq('Suffix', accountData.accountNumber.suffix);
    
    if (existingAccountError) {
      console.error('Error checking existing account:', existingAccountError);
      throw new Error('Failed to check existing account');
    }
    
    if (existingAccounts && existingAccounts.length > 0) {
      throw new Error(`Account number ${fullAccountNumber} already exists. Please use a different combination.`);
    }
    
    const newAccountId = uuidv4();
    const { data, error } = await supabase
      .from('account')
      .insert([
        {
          AccountID: newAccountId,
          Number: accountData.accountNumber.base,
          Code: accountData.accountNumber.typeCode,
          Suffix: accountData.accountNumber.suffix,
          type: accountData.type,
          Status: accountData.status,
          Opened: new Date().toISOString(),
          memberIds: [memberId],
          Balance: accountData.balance,
          CreatedDate: new Date().toISOString(),
          UpdatedDate: new Date().toISOString(),
          Active: new Date().toISOString(),
          Closed: null,
          ExternalID: '',
          ExtraField1: '',
          ExtraField2: '',
          ExtraField3: '',
          ExtraField4: '',
          ExtraField5: ''
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating account:', error);
      throw new Error('Failed to create account');
    }
    
    // Create folder structure for the new account
    await createFoldersFromTemplate('account', data.AccountID);
    
    return {
      id: data.AccountID,
      accountNumber: {
        base: data.Number,
        typeCode: data.Code,
        suffix: data.Suffix
      },
      type: data.type,
      status: data.Status,
      dateOpened: new Date(data.Opened),
      memberIds: data.memberIds,
      balance: data.Balance
    };
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}

export async function validateAccountNumber(
  base: string,
  typeCode: string,
  suffix: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('account')
    .select('AccountID')
    .eq('Number', base)
    .eq('Code', typeCode)
    .eq('Suffix', suffix);
  
  if (error) {
    console.error('Error validating account number:', error);
    throw new Error('Failed to validate account number');
  }
  
  return data.length === 0;
}

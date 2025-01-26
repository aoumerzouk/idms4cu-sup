import { supabase } from '../../lib/supabase';
    import type { Account } from '../../types/account';
    import { createFoldersFromTemplate } from './folderService';
    import { generateAccountNumber } from '../../utils/accountUtils';

    export async function getAccounts(): Promise<Account[]> {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('opened', { ascending: false });
      
      if (error) {
        console.error('Error fetching accounts:', error);
        throw new Error('Failed to load accounts');
      }
      
      return data.map(item => ({
        id: item.accountid,
        accountNumber: {
          base: item.number,
          typeCode: item.code,
          suffix: item.suffix
        },
        type: item.type,
        status: item.status,
        dateOpened: new Date(item.opened),
        memberIds: item.memberIds,
        balance: item.balance
      }));
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
          .from('accounts')
          .select('accountid')
          .eq('number', accountData.accountNumber.base)
          .eq('code', accountData.accountNumber.typeCode)
          .eq('suffix', accountData.accountNumber.suffix);
        
        if (existingAccountError) {
          console.error('Error checking existing account:', existingAccountError);
          throw new Error('Failed to check existing account');
        }
        
        if (existingAccounts && existingAccounts.length > 0) {
          throw new Error(`Account number ${fullAccountNumber} already exists. Please use a different combination.`);
        }
        
        const { data, error } = await supabase
          .from('accounts')
          .insert([
            {
              number: accountData.accountNumber.base,
              code: accountData.accountNumber.typeCode,
              suffix: accountData.accountNumber.suffix,
              type: accountData.type,
              status: accountData.status,
              opened: new Date().toISOString(),
              memberIds: [memberId],
              balance: accountData.balance,
              createddate: new Date().toISOString(),
              updateddate: new Date().toISOString()
            }
          ])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating account:', error);
          throw new Error('Failed to create account');
        }
        
        // Create folder structure for the new account
        await createFoldersFromTemplate('account', data.accountid);
        
        return {
          id: data.accountid,
          accountNumber: {
            base: data.number,
            typeCode: data.code,
            suffix: data.suffix
          },
          type: data.type,
          status: data.status,
          dateOpened: new Date(data.opened),
          memberIds: data.memberIds,
          balance: data.balance
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
        .from('accounts')
        .select('accountid')
        .eq('number', base)
        .eq('code', typeCode)
        .eq('suffix', suffix);
      
      if (error) {
        console.error('Error validating account number:', error);
        throw new Error('Failed to validate account number');
      }
      
      return data.length === 0;
    }

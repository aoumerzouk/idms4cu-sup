import { supabase } from '../lib/supabase';
    import type { Account } from '../types/account';

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
            balance: accountData.balance
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating account:', error);
        throw new Error('Failed to create account');
      }
      
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
    }

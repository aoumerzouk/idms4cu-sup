import { supabase } from '../lib/supabase';
    import { DEFAULT_ROLES } from '../config/permissions';

    export async function seedDatabase() {
      try {
        // Initialize roles
        for (const [id, role] of Object.entries(DEFAULT_ROLES)) {
          const { error } = await supabase
            .from('roles')
            .insert([{
              id,
              name: role.name,
              description: role.description,
              permissions: role.permissions,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }]);
          if (error) {
            console.error('Error seeding roles:', error);
            throw error;
          }
        }

        // Create a sample admin user role
        const { error: userRoleError } = await supabase
          .from('user_roles')
          .insert([{
            user_id: 'admin',
            role_id: 'admin',
            assigned_at: new Date().toISOString()
          }]);
        if (userRoleError) {
          console.error('Error seeding user roles:', userRoleError);
          throw userRoleError;
        }

        // Create sample member
        const { error: memberError } = await supabase
          .from('members')
          .insert([{
            firstName: 'John',
            lastName: 'Doe',
            memberNumber: '100001',
            email: ['john.doe@example.com'],
            phone: {
              primary: '555-0100',
              secondary: ''
            },
            address: {
              street: '123 Main St',
              city: 'Springfield',
              state: 'IL',
              zipCode: '62701'
            },
            dateJoined: new Date().toISOString(),
            status: 'active'
          }]);
        if (memberError) {
          console.error('Error seeding members:', memberError);
          throw memberError;
        }

        // Create sample account
        const { error: accountError } = await supabase
          .from('accounts')
          .insert([{
            accountNumber: {
              base: '1000001',
              typeCode: '001',
              suffix: '000'
            },
            type: 'share',
            status: 'active',
            dateOpened: new Date().toISOString(),
            memberIds: ['member1'],
            balance: 1000.00
          }]);
        if (accountError) {
          console.error('Error seeding accounts:', accountError);
          throw accountError;
        }

        // Create member-account relationship
        const { error: memberAccountError } = await supabase
          .from('memberAccounts')
          .insert([{
            memberId: 'member1',
            accountId: 'account1'
          }]);
        if (memberAccountError) {
          console.error('Error seeding member accounts:', memberAccountError);
          throw memberAccountError;
        }

        console.log('Database seeded successfully');
        return true;
      } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
      }
    }

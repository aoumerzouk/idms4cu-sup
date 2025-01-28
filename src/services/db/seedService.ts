import { supabase } from '../../lib/supabase';
import { DEFAULT_ROLES } from '../../config/permissions';
import { DEFAULT_DOCUMENT_CATEGORIES } from '../../config/defaultDocumentIndexes';
import type { DocumentCategory } from '../../types/documentCategory';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_ACCOUNT_TEMPLATES = [
  {
    id: 'account-opening',
    name: 'Account Opening Documents',
    isOptional: false,
    entityType: 'account',
    subfolders: []
  },
  {
    id: 'account-statements',
    name: 'Statements',
    isOptional: false,
    entityType: 'account',
    subfolders: []
  },
  {
    id: 'account-transfers',
    name: 'Transfers',
    isOptional: true,
    entityType: 'account',
    subfolders: []
  },
  {
    id: 'account-loans',
    name: 'Loan Documents',
    isOptional: true,
    entityType: 'account',
    subfolders: [
      { 
        id: 'loan-application', 
        name: 'Applications', 
        isOptional: true, 
        entityType: 'account', 
        subfolders: [] 
      },
      { 
        id: 'loan-collateral', 
        name: 'Collateral', 
        isOptional: true, 
        entityType: 'account', 
        subfolders: [] 
      },
      { 
        id: 'loan-payments', 
        name: 'Payment History', 
        isOptional: true, 
        entityType: 'account', 
        subfolders: [] 
      }
    ]
  }
];

export async function initializeDatabase() {
  try {
    // Test database connection
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) {
      throw new Error('Could not connect to Supabase: ' + error.message);
    }
    
    // Check if database is empty
    if (data.length === 0) {
      // Database is empty, seed it with initial data
      await seedDatabase();
    }

    // Initialize account folder templates if they don't exist
    const { data: accountTemplatesData, error: accountTemplatesError } = await supabase
      .from('settings')
      .select('id')
      .eq('id', 'accountFolderTemplates')
      .single();

    if (accountTemplatesError) {
      console.error('Error checking account folder templates:', accountTemplatesError);
      throw new Error('Failed to check account folder templates');
    }

    if (!accountTemplatesData) {
      console.log('Initializing account folder templates...');
      await supabase
        .from('settings')
        .insert([{
          id: 'accountFolderTemplates',
          templates: DEFAULT_ACCOUNT_TEMPLATES
        }]);
      console.log('Account folder templates created successfully');
    }
    
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function assignAdminRole() {
  const ADMIN_USER_ID = 'l5y1rCDFumdgqX0Feb4sGAeUWWJ2';
  const ADMIN_EMAIL = 'aoumerzouk@hotmail.com';
  
  try {
    console.log('Checking admin user and role...');
    
    // Check if user exists in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Error checking user in Supabase Auth:', authError);
      throw new Error('Failed to check user in Supabase Auth');
    }
    
    let userId = authData?.user?.id;
    
    if (!userId) {
      console.log('Creating admin user document...');
      const newUserId = uuidv4();
      await supabase
        .from('users')
        .insert([{
          id: newUserId,
          email: ADMIN_EMAIL,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          isactive: true,
          password: 'password'
        }])
        .select()
        .single();
      userId = newUserId.id;
    }
  } catch (error) {
    console.error('Error assigning admin role:', error);
    throw error;
  }
}

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
      .from('customer')
      .insert([{
        FirstName: 'John',
        LastName: 'Doe',
        CustomerNumber: '100001',
        Email: 'john.doe@example.com',
        CreatedDate: new Date().toISOString(),
      }]);
    if (memberError) {
      console.error('Error seeding members:', memberError);
      throw memberError;
    }

    // Create sample account
    const { error: accountError } = await supabase
      .from('account')
      .insert([{
        Number: '1000001',
        Code: '001',
        Suffix: '000',
        type: 'share',
        Status: 'active',
        Opened: new Date().toISOString(),
        Balance: 1000.00,
        CreatedDate: new Date().toISOString(),
        UpdatedDate: new Date().toISOString()
      }]);
    if (accountError) {
      console.error('Error seeding accounts:', accountError);
      throw accountError;
    }

    // Create member-account relationship
    const { error: memberAccountError } = await supabase
      .from('customeraccount')
      .insert([{
        CustomerID: 'l5y1rCDFumdgqX0Feb4sGAeUWWJ2',
        AccountID: 'account1'
      }]);
    if (memberAccountError) {
      console.error('Error seeding member accounts:', memberAccountError);
      throw memberAccountError;
    }

    // Seed CustomerType table
    const customerTypes = [
      { Name: 'Member', Description: 'A regular member' },
      { Name: 'Estate', Description: 'An estate account' },
      { Name: 'Business', Description: 'A business account' },
      { Name: 'AccountHolder', Description: 'An account holder' },
      { Name: 'Trust', Description: 'A trust account' },
      { Name: 'Employee', Description: 'An employee account' },
      { Name: 'Unknown', Description: 'Unknown account type' }
    ];

    for (const type of customerTypes) {
      const { error: customerTypeError } = await supabase
        .from('customertype')
        .insert([{
          CustomerTypeID: uuidv4(),
          Name: type.Name,
          Description: type.Description,
          CreatedDate: new Date().toISOString(),
          UpdatedDate: new Date().toISOString()
        }]);
      if (customerTypeError) {
        console.error('Error seeding customer types:', customerTypeError);
        throw customerTypeError;
      }
    }

    // Seed CustomerAccountRelationType table
    const customerAccountRelationTypes = [
      { Name: 'Co-Borrower', Description: 'Co-Borrower' },
      { Name: 'Guarantor', Description: 'Account Guarantor' },
      { Name: 'Joint', Description: 'Joint Account Holder' },
      { Name: 'Primary', Description: 'Primary Account Holder' },
      { Name: 'Signer', Description: 'Account Signatory' },
      { Name: 'Borrower', Description: 'Primary Borrower' },
      { Name: 'Unknown', Description: 'Unknown Customer Account Relation Type' },
      { Name: 'Customer', Description: null }
    ];

    for (const type of customerAccountRelationTypes) {
      const { error: customerAccountRelationTypeError } = await supabase
        .from('customeraccountrelationtype')
        .insert([{
          CustomerAccountRelationTypeID: uuidv4(),
          Name: type.Name,
          Description: type.Description,
          CreatedDate: new Date().toISOString(),
          UpdatedDate: new Date().toISOString(),
          RelationshipRank: 0
        }]);
      if (customerAccountRelationTypeError) {
        console.error('Error seeding customer account relation types:', customerAccountRelationTypeError);
        throw customerAccountRelationTypeError;
      }
    }

    console.log('Database seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

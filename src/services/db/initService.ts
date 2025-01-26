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

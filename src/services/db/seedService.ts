import { supabase } from '../../lib/supabase';

export async function seedDatabase() {
  try {
    console.log('Database seeding skipped.');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

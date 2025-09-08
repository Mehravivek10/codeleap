// scripts/create-test-user.ts
import { getAdminAuth } from '../src/lib/firebase/admin';

async function createTestUser() {
  try {
    const auth = getAdminAuth();
    
    // Create a test user
    const userRecord = await auth.createUser({
      email: 'test@example.com',
      password: 'password123',
      emailVerified: true,
      displayName: 'Test User',
    });

    console.log('Successfully created test user:', userRecord.uid);
    console.log('Email:', userRecord.email);
    console.log('Password: password123');
    
    // Create a custom token for testing
    const token = await auth.createCustomToken(userRecord.uid);
    console.log('Custom token for testing:', token);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();

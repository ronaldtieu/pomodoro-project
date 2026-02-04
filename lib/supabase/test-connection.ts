/**
 * Simple utility to test Supabase connection
 * This can be run in a browser console or Node.js environment
 */

export const testSupabaseConnection = async () => {
  const results = {
    envVars: false,
    clientCreation: false,
    connection: false,
    error: null as string | null,
  };

  // Check environment variables
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    results.envVars = true;
  } else {
    results.error = 'Missing environment variables';
    return results;
  }

  try {
    // Dynamically import to avoid issues with different environments
    const { createClient } = await import('./client');
    const client = createClient();
    results.clientCreation = true;

    // Test connection by checking auth session
    const { data, error } = await client.auth.getSession();

    if (error) {
      results.error = `Auth error: ${error.message}`;
      return results;
    }

    results.connection = true;
    return results;
  } catch (err) {
    results.error = err instanceof Error ? err.message : 'Unknown error';
    return results;
  }
};

/**
 * Log connection test results to console
 * Run this in browser console: testConnection()
 */
export const testConnection = async () => {
  console.log('🔍 Testing Supabase connection...');
  console.log('📋 Environment Check:');
  console.log('  URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log(
    '  Anon Key:',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'
  );

  const results = await testSupabaseConnection();

  console.log('\n📊 Test Results:');
  console.log('  Environment Variables:', results.envVars ? '✅' : '❌');
  console.log('  Client Creation:', results.clientCreation ? '✅' : '❌');
  console.log('  Connection:', results.connection ? '✅' : '❌');

  if (results.error) {
    console.error('\n❌ Error:', results.error);
  } else {
    console.log('\n✅ Supabase connection successful!');
  }

  return results;
};

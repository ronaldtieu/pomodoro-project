'use client';

import { useEffect, useState } from 'react';

interface TestResult {
  envVars: boolean;
  clientCreation: boolean;
  connection: boolean;
  error: string | null;
}

export default function TestConnectionPage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      const results: TestResult = {
        envVars: false,
        clientCreation: false,
        connection: false,
        error: null,
      };

      // Check environment variables
      const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
      const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      results.envVars = hasUrl && hasKey;

      if (!results.envVars) {
        results.error = 'Missing environment variables';
        setTestResult(results);
        setLoading(false);
        return;
      }

      try {
        // Dynamically import to avoid SSR issues
        const { createClient } = await import('@/lib/supabase/client');
        const client = createClient();
        results.clientCreation = true;

        // Test connection by checking auth session
        const { data, error } = await client.auth.getSession();

        if (error) {
          results.error = `Auth error: ${error.message}`;
        } else {
          results.connection = true;
        }
      } catch (err) {
        results.error = err instanceof Error ? err.message : 'Unknown error';
      }

      setTestResult(results);
      setLoading(false);
    };

    testConnection();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Testing Supabase connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Supabase Connection Test
        </h1>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Environment Variables</span>
            {testResult?.envVars ? (
              <span className="text-green-600 font-semibold">✓ Set</span>
            ) : (
              <span className="text-red-600 font-semibold">✗ Missing</span>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Client Creation</span>
            {testResult?.clientCreation ? (
              <span className="text-green-600 font-semibold">✓ Success</span>
            ) : (
              <span className="text-red-600 font-semibold">✗ Failed</span>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Connection</span>
            {testResult?.connection ? (
              <span className="text-green-600 font-semibold">✓ Success</span>
            ) : (
              <span className="text-red-600 font-semibold">✗ Failed</span>
            )}
          </div>

          {testResult?.error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                <strong>Error:</strong> {testResult.error}
              </p>
            </div>
          )}

          {testResult?.envVars && testResult?.clientCreation && testResult?.connection && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold mb-2">✓ Success!</p>
              <p className="text-green-700 text-sm">
                Your Supabase connection is working correctly. You can now use the app.
              </p>
              <a
                href="/signup"
                className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Go to Signup
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Configuration Details</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>URL:</strong>{' '}
              {process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30)}...
            </p>
            <p>
              <strong>Anon Key:</strong>{' '}
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

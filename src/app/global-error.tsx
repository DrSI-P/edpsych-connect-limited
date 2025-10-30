'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

/**
 * Global Error page for App Router
 * 
 * This component is used when an error occurs in the root layout or is not caught
 * by other error boundaries. It provides a minimal error display since it can't
 * rely on the app's layout being available.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Safely log the error to the console in development
  try {
    React.useEffect(() => {
      if (error) console.error('Global Error:', error);
    }, [error]);
  } catch {
    console.error('Global Error boundary failed to initialize');
  }

  if (typeof window === 'undefined' || typeof React === 'undefined' || !React.useContext) {
    return (
      <html lang="en">
        <body>
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <h1>500</h1>
            <p>Internal Server Error</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full mx-auto p-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
            
            <div className="mb-6 p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
              <p className="font-medium">
                The application encountered a critical error.
              </p>
              <p className="text-sm mt-2">
                {process.env.NODE_ENV === 'development' 
                  ? error.message || 'An unknown error occurred'
                  : 'Our team has been notified and is working to fix the issue.'
                }
              </p>
              
              {process.env.NODE_ENV === 'development' && error.stack && (
                <details className="text-left mt-4">
                  <summary className="cursor-pointer text-sm">Error details</summary>
                  <pre className="mt-2 p-2 bg-muted rounded-md text-xs overflow-auto max-h-[200px] text-left">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
            
            <Button 
              onClick={reset}
              className="gap-2 mx-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
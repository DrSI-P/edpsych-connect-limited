'use client';

import React from 'react';
import { ErrorDisplay } from '../components/error-handling/ErrorDisplay';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

/**
 * Error page for App Router
 * 
 * This component handles errors that occur during rendering of a route segment
 * and provides a user-friendly error display with a reset option.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Safely log the error to the console in development
  try {
    React.useEffect(() => {
      if (error) console.error('Route Error:', error);
    }, [error]);
  } catch {
    console.error('Error boundary failed to initialize');
  }

  return (
    <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[50vh]">
      <div className="max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Something went wrong</h1>
        
        <ErrorDisplay 
          title="We've encountered an error"
          error={error}
          showDetails={process.env.NODE_ENV === 'development'}
          className="mb-6"
        />
        
        <div className="flex justify-center">
          <Button 
            onClick={reset}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Loader2 } from 'lucide-react';

function LoadingSpinner({ message = 'Loading...', size = 40 }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <Loader2 className="animate-spin text-primary" size={size} />
      {message && (
        <p className="text-base text-muted-foreground">
          {message}
        </p>
      )}
    </div>
  );
}

export default LoadingSpinner;

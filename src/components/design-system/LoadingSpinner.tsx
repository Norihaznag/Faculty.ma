import React from 'react';

export function LoadingSpinner(): React.ReactNode {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative w-12 h-12">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-slate-900 border-r-slate-900 animate-spin"></div>
        
        {/* Middle pulsing ring */}
        <div className="absolute inset-2 rounded-full border-2 border-slate-200 animate-pulse"></div>
        
        {/* Inner dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-slate-900 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <p className="ml-4 text-sm text-slate-600 font-medium">Loading...</p>
    </div>
  );
}

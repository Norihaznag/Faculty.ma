import React from 'react';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', interactive = false, onClick }: CardProps): React.ReactNode {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-slate-200
        transition-all duration-200
        ${interactive ? 'hover:shadow-md hover:border-slate-300 cursor-pointer' : 'shadow-sm'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

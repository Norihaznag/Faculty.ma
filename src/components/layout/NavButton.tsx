import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface NavButtonProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}

export function NavButton({ icon: Icon, label, active, onClick }: NavButtonProps): React.ReactNode {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 text-sm border-b-2 transition ${
        active
          ? 'border-blue-600 text-blue-600 bg-gray-50'
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-xs">{label}</span>
    </button>
  );
}

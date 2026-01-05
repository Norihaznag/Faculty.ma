import React from 'react';
import { LogOut } from 'lucide-react';
import type { User } from '../../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps): React.ReactNode {
  return (
    <header className="bg-white border-b border-gray-300">
      <div className="max-w-full px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-gray-900">Faculty Management</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium border border-gray-300">
              {user.role === 'admin' ? 'Admin' : 'Moderator'}
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

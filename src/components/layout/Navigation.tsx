import React from 'react';
import { Home, Plus, Search, Settings } from 'lucide-react';
import { NavButton } from './NavButton';

type ViewType = 'home' | 'create-university' | 'create-school' | 'browse' | 'admin';

interface NavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps): React.ReactNode {
  return (
    <nav className="bg-white border-b border-gray-300">
      <div className="max-w-full px-4">
        <div className="flex gap-0 py-0">
          <NavButton
            icon={Home}
            label="Home"
            active={currentView === 'home'}
            onClick={() => onViewChange('home')}
          />
          <NavButton
            icon={Plus}
            label="Add University"
            active={currentView === 'create-university'}
            onClick={() => onViewChange('create-university')}
          />
          <NavButton
            icon={Plus}
            label="Add School"
            active={currentView === 'create-school'}
            onClick={() => onViewChange('create-school')}
          />
          <NavButton
            icon={Search}
            label="Browse"
            active={currentView === 'browse'}
            onClick={() => onViewChange('browse')}
          />
          <NavButton
            icon={Settings}
            label="Database"
            active={currentView === 'admin'}
            onClick={() => onViewChange('admin')}
          />
        </div>
      </div>
    </nav>
  );
}

import React from 'react';
import type { User } from '../../types';
import type { LucideIcon } from 'lucide-react';
import {
  Home,
  FileText,
  BookOpen,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '../design-system';

type ViewType = 'home' | 'create-university' | 'create-school' | 'browse' | 'admin';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  children: React.ReactNode;
}

interface NavItem {
  id: ViewType;
  label: string;
  icon: LucideIcon;
  roles?: Array<'admin' | 'moderator'>;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: Home,
    roles: ['admin', 'moderator'],
  },
  {
    id: 'create-university',
    label: 'Add University Post',
    icon: FileText,
    roles: ['admin', 'moderator'],
  },
  {
    id: 'create-school',
    label: 'Add School Post',
    icon: FileText,
    roles: ['admin', 'moderator'],
  },
  {
    id: 'browse',
    label: 'Browse Content',
    icon: BookOpen,
    roles: ['admin', 'moderator'],
  },
  {
    id: 'admin',
    label: 'Admin Panel',
    icon: Settings,
    roles: ['admin', 'moderator'],
  },
];

export function Layout({ user, onLogout, currentView, onViewChange, children }: LayoutProps): React.ReactNode {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const visibleNavItems = navItems.filter((item) => !item.roles || item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`
          bg-white border-r border-slate-200
          transition-all duration-300
          ${sidebarOpen ? 'w-64' : 'w-20'}
          flex flex-col
          h-screen sticky top-0
        `}
      >
        {/* Logo/Brand */}
        <div className="px-6 py-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="font-bold text-lg text-slate-900">CMS</h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-600"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200 group
                  ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }
                `}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                {sidebarOpen && isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="px-3 py-4 border-t border-slate-200 space-y-3">
          {sidebarOpen && (
            <div className="px-3 py-2 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600">Logged in as</p>
              <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded font-medium">
                {user.role === 'admin' ? 'Admin' : 'Moderator'}
              </span>
            </div>
          )}
          <Button
            onClick={onLogout}
            variant="subtle"
            size="sm"
            fullWidth={sidebarOpen}
            icon={LogOut}
            className={sidebarOpen ? 'justify-start w-full' : '!p-2 w-full'}
          >
            {sidebarOpen && 'Logout'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

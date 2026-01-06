import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { checkUserSafe } from './lib/supabaseWithFallback';
import { LoginPage } from './components/auth/LoginPage';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { CreateUniversityPost } from './components/posts/CreateUniversityPost';
import { CreateSchoolPost } from './components/posts/CreateSchoolPost';
import { BrowseContent } from './components/posts/BrowseContent';
import { AdminPanel } from './components/admin/AdminPanel';
import type { User } from './types';

// Main App Component
export default function App(): React.ReactNode {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'create-university' | 'create-school' | 'browse' | 'admin'>('home');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async (): Promise<void> => {
    try {
      const userData = await checkUserSafe();
      setUser(userData);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentView('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={checkUser} />;
  }

  return (
    <Layout
      user={user}
      onLogout={handleLogout}
      currentView={currentView}
      onViewChange={setCurrentView}
    >
      {currentView === 'home' && (
        <Dashboard user={user} onNavigate={setCurrentView} />
      )}
      {currentView === 'create-university' && <CreateUniversityPost onBack={() => setCurrentView('home')} />}
      {currentView === 'create-school' && <CreateSchoolPost onBack={() => setCurrentView('home')} />}
      {currentView === 'browse' && <BrowseContent />}
      {currentView === 'admin' && user.role === 'admin' && <AdminPanel />}
    </Layout>
  );
}

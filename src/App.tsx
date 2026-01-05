import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { checkUserSafe } from './lib/supabaseWithFallback';
import { LoginPage } from './components/auth/LoginPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { CreateUniversityPost } from './components/posts/CreateUniversityPost';
import { CreateSchoolPost } from './components/posts/CreateSchoolPost';
import { BrowseContent } from './components/posts/BrowseContent';
import { AdminPanel } from './components/admin/AdminPanel';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={checkUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header user={user} onLogout={handleLogout} />
      <Navigation currentView={currentView} onViewChange={setCurrentView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && <Dashboard />}
        {currentView === 'create-university' && <CreateUniversityPost />}
        {currentView === 'create-school' && <CreateSchoolPost />}
        {currentView === 'browse' && <BrowseContent />}
        {currentView === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
}

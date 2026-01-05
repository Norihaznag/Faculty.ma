import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { supabase, isSupabaseReady } from '../../lib/supabase';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps): React.ReactNode {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (): Promise<void> => {
    setError('');
    
    if (!email.trim()) {
      setError('Email required');
      return;
    }
    
    if (!password) {
      setError('Password required');
      return;
    }

    setLoading(true);

    try {
      if (!isSupabaseReady()) {
        onLogin();
        return;
      }

      const { error: authError } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      if (authError) throw authError;
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-gray-50 border border-gray-300 p-8 w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-base font-bold text-gray-900 mb-1">Faculty Management</h1>
          <p className="text-xs text-gray-600">Sign in to continue</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-2 py-1.5 border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-2 py-1.5 border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-2 bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!isSupabaseReady() && (
            <div className="p-2 bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Offline mode - click Sign In to access demo</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            onKeyPress={handleKeyPress}
            className="w-full bg-white text-gray-900 py-1.5 border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 font-medium"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}

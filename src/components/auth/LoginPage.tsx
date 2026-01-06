import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { supabase, isSupabaseReady } from '../../lib/supabase';
import { Button, Card, TextInput } from '../design-system';

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
      setError('Email is required');
      return;
    }

    if (!password) {
      setError('Password is required');
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
        password,
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
    if (e.key === 'Enter' && !loading) handleLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome</h1>
            <p className="text-slate-600">Sign in to the Education CMS</p>
          </div>

          <div className="space-y-4">
            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              onKeyPress={handleKeyPress}
              placeholder="admin@example.com"
              required
            />

            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              onKeyPress={handleKeyPress}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">{error}</p>
                </div>
              </div>
            )}

            {!isSupabaseReady() && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Offline mode</p>
                  <p className="text-xs text-blue-800">Click Sign In to access the demo</p>
                </div>
              </div>
            )}

            <Button
              onClick={handleLogin}
              disabled={loading}
              loading={loading}
              fullWidth
              size="md"
            >
              Sign In
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

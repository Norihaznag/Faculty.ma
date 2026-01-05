import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Edit2 } from 'lucide-react';
import type { Post } from '../../types';
import { fetchPublishedPostsSafe } from '../../lib/supabaseWithFallback';
import { StatCard } from './StatCard';

export function Dashboard(): React.ReactNode {
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async (): Promise<void> => {
    try {
      setLoading(true);
      const posts = await fetchPublishedPostsSafe();
      setStats({
        total: posts.length,
        published: posts.filter((p: Post) => p.published).length,
        draft: posts.filter((p: Post) => !p.published).length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white">
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900">Dashboard</h2>
      </div>

      {loading ? (
        <div className="p-4 text-sm text-gray-600">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <StatCard 
              icon={FileText}
              label="Total Posts" 
              value={stats.total} 
            />
            <StatCard 
              icon={CheckCircle}
              label="Published" 
              value={stats.published} 
            />
            <StatCard 
              icon={Edit2}
              label="Drafts" 
              value={stats.draft} 
            />
          </div>

          <div className="border border-gray-300 p-3 bg-gray-50">
            <p className="text-sm text-gray-700">Use the menu to add and manage educational content</p>
          </div>
        </>
      )}
    </div>
  );
}

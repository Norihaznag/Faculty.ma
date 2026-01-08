import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, BookOpen, Plus, Inbox, Layers } from 'lucide-react';
import type { Post, User } from '../../types';
import { fetchPublishedPostsSafe, fetchResourceRequestsSafe, fetchContentPacksSafe } from '../../lib/supabaseWithFallback';
import { Button, Card, Badge } from '../design-system';

interface DashboardProps {
  user: User;
  onNavigate: (view: 'create-university' | 'create-school' | 'browse') => void;
}

export function Dashboard({ user, onNavigate }: DashboardProps): React.ReactNode {
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, requests: 0, packs: 0 });
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (): Promise<void> => {
    try {
      const [data, requests, packs] = await Promise.all([
        fetchPublishedPostsSafe(),
        fetchResourceRequestsSafe(),
        fetchContentPacksSafe(),
      ]);
      const allPosts = (data as Post[]) || [];
      setPosts(allPosts.slice(0, 5)); // Show recent 5
      setStats({
        total: allPosts.length,
        published: allPosts.filter((p: Post) => p.published).length,
        draft: allPosts.filter((p: Post) => !p.published).length,
        requests: requests.length,
        packs: packs.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      // Removed setLoading(false) - variable was unused
    }
  };

  const isAdmin = ['admin', 'moderator'].includes(user.role);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome back, {user.email.split('@')[0]}</h1>
        <p className="text-slate-600">
          {isAdmin ? 'Manage the platform structure and content' : 'Upload and manage educational content'}
        </p>
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onNavigate('create-university')}
          interactive
        >
          <Plus className="w-6 h-6 text-blue-600 mb-3" />
          <h3 className="font-semibold text-slate-900 mb-1">New University Post</h3>
          <p className="text-sm text-slate-600">Add course materials, exams, or summaries for university students</p>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onNavigate('create-school')}
          interactive
        >
          <Plus className="w-6 h-6 text-green-600 mb-3" />
          <h3 className="font-semibold text-slate-900 mb-1">New School Post</h3>
          <p className="text-sm text-slate-600">Create content for secondary school students</p>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onNavigate('browse')}
          interactive
        >
          <BookOpen className="w-6 h-6 text-purple-600 mb-3" />
          <h3 className="font-semibold text-slate-900 mb-1">Browse Content</h3>
          <p className="text-sm text-slate-600">View, filter, and manage published content</p>
        </Card>
      </div>

      {/* Stats Overview */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Content Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Posts</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Published</p>
                <p className="text-2xl font-bold text-slate-900">{stats.published}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Drafts</p>
                <p className="text-2xl font-bold text-slate-900">{stats.draft}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Inbox className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Requests</p>
                <p className="text-2xl font-bold text-slate-900">{stats.requests}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Packs</p>
                <p className="text-2xl font-bold text-slate-900">{stats.packs}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Posts */}
      {posts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Posts</h2>
            <Button variant="subtle" size="sm" onClick={() => onNavigate('browse')}>
              View all
            </Button>
          </div>

          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id} className="p-4" interactive>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-slate-900">{post.title}</h3>
                      <Badge
                        label={post.content_type}
                        variant="primary"
                      />
                      <Badge
                        label={post.published ? 'Published' : 'Draft'}
                        variant={post.published ? 'success' : 'warning'}
                      />
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-1">{post.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

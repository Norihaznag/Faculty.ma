import React, { useState, useEffect } from 'react';
import { Eye, BookOpen, Search } from 'lucide-react';
import { fetchPublishedPostsSafe } from '../../lib/supabaseWithFallback';
import { Button, Card, Badge, EmptyState, Modal } from '../design-system';
import type { Post } from '../../types';

export function BrowseContent(): React.ReactNode {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'course' | 'exam' | 'summary' | 'td' | 'link'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [posts, searchTerm, filterType, filterStatus]);

  const loadPosts = async (): Promise<void> => {
    try {
      const data = await fetchPublishedPostsSafe();
      setPosts((data as Post[]) || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (): void => {
    let filtered = posts;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((p) => p.content_type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((p) =>
        filterStatus === 'published' ? p.published : !p.published
      );
    }

    setFilteredPosts(filtered);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-900 mb-4" />
        <p className="text-slate-600">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Browse Content</h1>
        <p className="text-slate-600">View and manage all uploaded educational materials</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            <label className="text-sm font-medium text-slate-700 flex items-center">Type:</label>
            {(['all', 'course', 'exam', 'summary', 'td', 'link'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filterType === type
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <label className="text-sm font-medium text-slate-700 flex items-center">Status:</label>
            {(['all', 'published', 'draft'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filterStatus === status
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content List */}
      {filteredPosts.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No content found"
          description={
            posts.length === 0 ? 'Start creating content to see it here' : 'Try adjusting your filters'
          }
        />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Showing {filteredPosts.length} of {posts.length} items
          </p>
          <div className="space-y-2">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="p-4 cursor-pointer"
                interactive
                onClick={() => setSelectedPost(post)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-slate-900">{post.title}</h3>
                      <Badge label={post.content_type} variant="primary" />
                      <Badge
                        label={post.published ? 'Published' : 'Draft'}
                        variant={post.published ? 'success' : 'warning'}
                      />
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{post.description}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPost(post);
                    }}
                    className="ml-4 p-2 hover:bg-slate-100 rounded-lg transition"
                    title="View details"
                  >
                    <Eye className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      <Modal
        isOpen={selectedPost !== null}
        title={selectedPost?.title || ''}
        onClose={() => setSelectedPost(null)}
        maxWidth="lg"
      >
        {selectedPost && (
          <div className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              <Badge label={selectedPost.content_type} variant="primary" />
              <Badge
                label={selectedPost.published ? 'Published' : 'Draft'}
                variant={selectedPost.published ? 'success' : 'warning'}
              />
              <Badge
                label={selectedPost.education_type === 'university' ? 'University' : 'School'}
                variant="neutral"
              />
            </div>

            <div>
              <p className="text-sm text-slate-600 font-medium mb-1">Description</p>
              <p className="text-slate-900">{selectedPost.description}</p>
            </div>

            {selectedPost.file_url && (
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">File</p>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Download}
                  onClick={() => window.open(selectedPost.file_url, '_blank')}
                >
                  Download
                </Button>
              </div>
            )}

            {selectedPost.embed_url && (
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">Embedded Content</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.open(selectedPost.embed_url, '_blank')}
                >
                  View Embed
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
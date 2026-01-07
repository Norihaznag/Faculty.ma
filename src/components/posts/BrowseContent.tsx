import React, { useState, useEffect } from 'react';
import { Eye, BookOpen, Download } from 'lucide-react';
import { fetchPublishedPostsSafe } from '../../lib/supabaseWithFallback';
import { Button, Card, Badge, EmptyState } from '../design-system';
import { PostFilters } from './PostFilters';
import { PostPreviewModal } from './PostPreviewModal';
import { PostStats } from './PostStats';
import type { Post } from '../../types';

export function BrowseContent(): React.ReactNode {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showStats, setShowStats] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [contentType, setContentType] = useState('');
  const [educationType, setEducationType] = useState('');
  const [publishStatus, setPublishStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [posts, searchTerm, contentType, educationType, publishStatus, sortBy]);

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

  const applyFiltersAndSort = (): void => {
    let filtered = posts;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(term) || 
          p.description.toLowerCase().includes(term)
      );
    }

    // Content type filter
    if (contentType) {
      filtered = filtered.filter((p) => p.content_type === contentType);
    }

    // Education type filter
    if (educationType) {
      filtered = filtered.filter((p) => p.education_type === educationType);
    }

    // Publish status filter
    if (publishStatus) {
      filtered = filtered.filter((p) =>
        publishStatus === 'published' ? p.published : !p.published
      );
    }

    // Sort
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredPosts(filtered);
  };

  const hasActiveFilters = !!(searchTerm || contentType || educationType || publishStatus);

  const clearFilters = (): void => {
    setSearchTerm('');
    setContentType('');
    setEducationType('');
    setPublishStatus('');
    setSortBy('newest');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Browse Content</h1>
        <p className="text-slate-600">View and manage all uploaded educational materials</p>
      </div>

      {/* Stats Toggle */}
      <div className="flex justify-between items-center">
        <div />
        <Button
          variant={showStats ? 'primary' : 'secondary'}
          onClick={() => setShowStats(!showStats)}
          size="sm"
        >
          {showStats ? 'Hide' : 'Show'} Analytics
        </Button>
      </div>

      {/* Analytics Section */}
      {showStats && (
        <div className="border-l-4 border-blue-600 pl-6">
          <PostStats posts={posts} />
        </div>
      )}

      {/* Filters */}
      <PostFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        contentType={contentType}
        onContentTypeChange={setContentType}
        educationType={educationType}
        onEducationTypeChange={setEducationType}
        publishStatus={publishStatus}
        onPublishStatusChange={setPublishStatus}
        sortBy={sortBy}
        onSortChange={setSortBy}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      {/* Content List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-900 mb-4" />
          <p className="text-slate-600">Loading content...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
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
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
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

      {/* Post Preview Modal */}
      <PostPreviewModal
        isOpen={selectedPost !== null}
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
}
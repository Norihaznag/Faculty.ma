import React, { useState, useEffect } from 'react';
import { Eye, BookOpen } from 'lucide-react';
import { fetchPublishedPostsSafe } from '../../lib/supabaseWithFallback';
import type { Post } from '../../types';

export function BrowseContent(): React.ReactNode {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (): Promise<void> => {
    try {
      const data = await fetchPublishedPostsSafe();
      setPosts(data as Post[]);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
        <p className="text-gray-600 mt-4">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Parcourir le Contenu</h2>

      <div className="grid gap-4">
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Aucun contenu trouvé</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                      {post.content_type}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        post.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {post.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{post.title}</h3>
                  <p className="text-gray-600 text-sm">{post.description}</p>
                </div>
                <button className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition">
                  <Eye className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Eye, BookOpen, X, Download, ExternalLink } from 'lucide-react';
import { fetchPublishedPostsSafe } from '../../lib/supabaseWithFallback';
import type { Post } from '../../types';

export function BrowseContent(): React.ReactNode {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

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

  const handleViewPost = (post: Post): void => {
    setSelectedPost(post);
  };

  const handleCloseModal = (): void => {
    setSelectedPost(null);
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
                <button
                  onClick={() => handleViewPost(post)}
                  className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Voir le détail"
                >
                  <Eye className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between sticky top-0 bg-gray-50 border-b border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedPost.title}</h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-200 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded">
                  {selectedPost.content_type}
                </span>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    selectedPost.published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {selectedPost.published ? 'Publié' : 'Brouillon'}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded">
                  {selectedPost.education_type === 'university' ? 'Université' : 'École'}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{selectedPost.description}</p>
              </div>

              {selectedPost.file_url && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fichier</h3>
                  <a
                    href={selectedPost.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger
                  </a>
                </div>
              )}

              {selectedPost.embed_url && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contenu Intégré</h3>
                  <a
                    href={selectedPost.embed_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ouvrir le lien
                  </a>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Créé le: {new Date(selectedPost.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}    </div>
  );
}
import { useState } from 'react';
import { Trash2, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { updatePostSafe, deletePostSafe, bulkUpdatePostsSafe, bulkDeletePostsSafe, insertPostSafe } from '../../lib/supabaseWithFallback';
import type { Post } from '../../types';

export function ProPostsTable({
  data,
  subjects,
  schoolSubjects,
  selectedIds,
  onSelectId,
  onRefresh,
  onError,
}: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [newPost, setNewPost] = useState<any>({
    title: '',
    description: '',
    content_type: 'course',
    education_type: 'university',
    subject_id: '',
    school_subject_id: '',
    file_url: '',
    embed_url: '',
    published: false,
  });
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleSave = async () => {
    if (!editForm.title?.trim() || !editingId) {
      onError('Title is required');
      return;
    }

    setSaving(true);
    try {
      await updatePostSafe(editingId, {
        title: editForm.title.trim(),
        description: editForm.description?.trim() || '',
        content_type: editForm.content_type,
        file_url: editForm.file_url || null,
        embed_url: editForm.embed_url || null,
      });
      setEditingId(null);
      await onRefresh();
    } catch (error) {
      onError('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim()) {
      onError('Title required');
      return;
    }

    const requiredId = newPost.education_type === 'university' ? newPost.subject_id : newPost.school_subject_id;
    if (!requiredId) {
      onError('Select a subject');
      return;
    }

    setSaving(true);
    try {
      const postData: any = {
        title: newPost.title.trim(),
        description: newPost.description.trim() || '',
        content_type: newPost.content_type,
        education_type: newPost.education_type,
        file_url: newPost.file_url || null,
        embed_url: newPost.embed_url || null,
        published: newPost.published,
      };

      if (newPost.education_type === 'university') {
        postData.subject_id = newPost.subject_id;
      } else {
        postData.school_subject_id = newPost.school_subject_id;
      }

      await insertPostSafe(postData);
      setNewPost({
        title: '',
        description: '',
        content_type: 'course',
        education_type: 'university',
        subject_id: '',
        school_subject_id: '',
        file_url: '',
        embed_url: '',
        published: false,
      });
      await onRefresh();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkPublish = async (published: boolean) => {
    if (selectedIds.size === 0) return;
    try {
      await bulkUpdatePostsSafe(Array.from(selectedIds), { published });
      await onRefresh();
    } catch (error) {
      onError('Failed to update');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Delete ${selectedIds.size} posts?`)) return;
    
    try {
      await bulkDeletePostsSafe(Array.from(selectedIds));
      await onRefresh();
    } catch (error) {
      onError('Failed to delete');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Management</h1>
          <p className="text-slate-600">Create, edit, and manage all educational posts across universities and schools</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex gap-3 flex-wrap items-center">
          <button
            onClick={() => setEditingId('new')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center gap-2"
          >
            <span>+ New Post</span>
          </button>

          {selectedIds.size > 0 && (
            <>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-sm font-medium text-gray-700">{selectedIds.size} selected</span>
              <button
                onClick={() => handleBulkPublish(true)}
                className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium rounded-lg transition flex items-center gap-2 border border-green-200"
              >
                <Eye className="w-4 h-4" />
                Publish
              </button>
              <button
                onClick={() => handleBulkPublish(false)}
                className="px-3 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-sm font-medium rounded-lg transition flex items-center gap-2 border border-yellow-200"
              >
                <EyeOff className="w-4 h-4" />
                Draft
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-lg transition flex items-center gap-2 border border-red-200"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>

        {/* New Post Form */}
        {editingId === 'new' && (
          <div className="bg-white rounded-lg border border-blue-200 border-l-4 border-l-blue-600 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Post</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <input
                autoFocus
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Title"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={newPost.education_type}
                onChange={(e) => setNewPost({ ...newPost, education_type: e.target.value, subject_id: '', school_subject_id: '' })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="university">University</option>
                <option value="school">School</option>
              </select>

              <select
                value={newPost.content_type}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setNewPost({ ...newPost, content_type: e.target.value })}
              >
                <option value="course">Course</option>
                <option value="exam">Exam</option>
                <option value="td">TD</option>
                <option value="summary">Summary</option>
                <option value="link">Link</option>
              </select>

              <select
                value={newPost.education_type === 'university' ? newPost.subject_id : newPost.school_subject_id}
                onChange={(e) => {
                  if (newPost.education_type === 'university') {
                    setNewPost({ ...newPost, subject_id: e.target.value });
                  } else {
                    setNewPost({ ...newPost, school_subject_id: e.target.value });
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Subject</option>
                {(newPost.education_type === 'university' ? subjects : schoolSubjects).map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <textarea
                value={newPost.description}
                onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                placeholder="Description (optional)"
                rows={2}
                className="lg:col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="url"
                value={newPost.file_url}
                onChange={(e) => setNewPost({ ...newPost, file_url: e.target.value })}
                placeholder="File URL (optional)"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="url"
                value={newPost.embed_url}
                onChange={(e) => setNewPost({ ...newPost, embed_url: e.target.value })}
                placeholder="Embed URL (optional)"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <label className="flex items-center gap-2 lg:col-span-2">
                <input
                  type="checkbox"
                  checked={newPost.published}
                  onChange={(e) => setNewPost({ ...newPost, published: e.target.checked })}
                  className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Publish immediately</span>
              </label>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCreatePost}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Posts Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === data.length && data.length > 0}
                      onChange={() => {}}
                      className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900">Title</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900">Type</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900">Education</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900">File</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-900">Created</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No posts yet
                    </td>
                  </tr>
                ) : (
                  data.map((post: Post) => (
                    <tr key={post.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(post.id)}
                          onChange={() => onSelectId(post.id)}
                          className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {editingId === post.id ? (
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <span className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer" onClick={() => {
                            setEditingId(post.id);
                            setEditForm(post);
                          }}>
                            {post.title}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {post.content_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {post.education_type === 'university' ? '🎓' : '📚'} {post.education_type}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={async () => {
                            try {
                              await updatePostSafe(post.id, { published: !post.published });
                              await onRefresh();
                            } catch (error) {
                              onError('Failed');
                            }
                          }}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            post.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {post.published ? '✓ Live' : '✎ Draft'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {post.file_url ? (
                          <button
                            onClick={() => copyToClipboard(post.file_url!, post.id)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            {copied === post.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {new Date(post.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {editingId === post.id ? (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={handleSave}
                              disabled={saving}
                              className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={async () => {
                              if (!window.confirm('Delete?')) return;
                              try {
                                await deletePostSafe(post.id);
                                await onRefresh();
                              } catch (error) {
                                onError('Failed');
                              }
                            }}
                            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs font-medium transition"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Footer */}
        {data.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-slate-600 font-medium uppercase tracking-wide">Total Posts</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{data.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Published</p>
              <p className="text-3xl font-bold text-green-700 mt-2">{data.filter((p: Post) => p.published).length}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="text-xs text-yellow-600 font-medium uppercase tracking-wide">Drafts</p>
              <p className="text-3xl font-bold text-yellow-700 mt-2">{data.filter((p: Post) => !p.published).length}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">With Files</p>
              <p className="text-3xl font-bold text-blue-700 mt-2">{data.filter((p: Post) => p.file_url).length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

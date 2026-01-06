import { useState } from 'react';
import { Trash2, Eye, EyeOff } from 'lucide-react';
import { updatePostSafe, deletePostSafe, bulkUpdatePostsSafe, bulkDeletePostsSafe, insertPostSafe } from '../../lib/supabaseWithFallback';
import type { Post, Subject, SchoolSubject } from '../../types';

export function PostsTable({
  data,
  subjects,
  schoolSubjects,
  selectedIds,
  onSelectId,
  onRefresh,
  onError,
}: any) {
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [postForm, setPostForm] = useState<any>({
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
  const [posting, setPosting] = useState(false);

  const handleCreatePost = async () => {
    if (!postForm.title.trim()) {
      onError('Title is required');
      return;
    }

    const requiredId = postForm.education_type === 'university' ? postForm.subject_id : postForm.school_subject_id;
    if (!requiredId) {
      onError('Please select a subject');
      return;
    }

    setPosting(true);
    try {
      const postData: any = {
        title: postForm.title.trim(),
        description: postForm.description.trim(),
        content_type: postForm.content_type,
        education_type: postForm.education_type,
        file_url: postForm.file_url || null,
        embed_url: postForm.embed_url || null,
        published: postForm.published,
      };

      if (postForm.education_type === 'university') {
        postData.subject_id = postForm.subject_id;
      } else {
        postData.school_subject_id = postForm.school_subject_id;
      }

      await insertPostSafe(postData);
      setShowNewPostModal(false);
      setPostForm({
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
      onError(error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleTogglePublish = async (postId: string, published: boolean) => {
    try {
      await updatePostSafe(postId, { published: !published });
      await onRefresh();
    } catch (error) {
      onError('Failed to update post');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      onError('Select posts to delete');
      return;
    }
    if (!window.confirm(`Delete ${selectedIds.size} posts?`)) return;
    
    try {
      await bulkDeletePostsSafe(Array.from(selectedIds));
      await onRefresh();
    } catch (error) {
      onError('Failed to delete posts');
    }
  };

  const handleBulkPublish = async (published: boolean) => {
    if (selectedIds.size === 0) {
      onError('Select posts first');
      return;
    }
    
    try {
      await bulkUpdatePostsSafe(Array.from(selectedIds), { published });
      await onRefresh();
    } catch (error) {
      onError('Failed to update posts');
    }
  };

  return (
    <div className="border border-gray-300">
      <div className="bg-gray-100 border-b border-gray-300 p-3 flex gap-2 flex-wrap items-center">
        <button
          onClick={() => setShowNewPostModal(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={posting}
        >
          + New Post
        </button>

        {selectedIds.size > 0 && (
          <>
            <span className="text-sm text-gray-700 font-medium">{selectedIds.size} selected</span>
            <button
              onClick={() => handleBulkPublish(true)}
              className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded hover:bg-green-200"
              disabled={posting}
            >
              <Eye className="w-4 h-4 inline mr-1" />
              Publish
            </button>
            <button
              onClick={() => handleBulkPublish(false)}
              className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded hover:bg-yellow-200"
              disabled={posting}
            >
              <EyeOff className="w-4 h-4 inline mr-1" />
              Unpublish
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded hover:bg-red-200"
              disabled={posting}
            >
              <Trash2 className="w-4 h-4 inline mr-1" />
              Delete
            </button>
          </>
        )}
      </div>

      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="px-2 py-2 text-left font-bold w-6">
              <input
                type="checkbox"
                checked={selectedIds.size === data.length && data.length > 0}
                onChange={() => {
                  // Handled by parent
                }}
                disabled={data.length === 0}
              />
            </th>
            <th className="px-3 py-2 text-left font-bold">Title</th>
            <th className="px-3 py-2 text-left font-bold">Type</th>
            <th className="px-3 py-2 text-left font-bold">Education</th>
            <th className="px-3 py-2 text-center font-bold">Status</th>
            <th className="px-3 py-2 text-left font-bold">Created</th>
            <th className="px-3 py-2 text-right font-bold w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-3 py-4 text-center text-gray-500">
                No posts
              </td>
            </tr>
          ) : (
            data.map((post: Post, idx: number) => (
              <tr key={post.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} style={{borderBottom: '1px solid #d1d5db'}}>
                <td className="px-2 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(post.id)}
                    onChange={() => onSelectId(post.id)}
                  />
                </td>
                <td className="px-3 py-2 font-medium truncate max-w-xs" title={post.title}>{post.title}</td>
                <td className="px-3 py-2"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">{post.content_type}</span></td>
                <td className="px-3 py-2"><span className="text-xs">{post.education_type === 'university' ? 'University' : 'School'}</span></td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => handleTogglePublish(post.id, post.published)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      post.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-3 py-2 text-xs text-gray-600">
                  {new Date(post.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={async () => {
                      if (!window.confirm('Delete this post?')) return;
                      try {
                        await deletePostSafe(post.id);
                        await onRefresh();
                      } catch (error) {
                        onError('Failed to delete');
                      }
                    }}
                    className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showNewPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Create New Post</h2>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={postForm.description}
                  onChange={(e) => setPostForm({ ...postForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Post description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education Type *</label>
                  <select
                    value={postForm.education_type}
                    onChange={(e) => setPostForm({ ...postForm, education_type: e.target.value, subject_id: '', school_subject_id: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="university">University</option>
                    <option value="school">School</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content Type *</label>
                  <select
                    value={postForm.content_type}
                    onChange={(e) => setPostForm({ ...postForm, content_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="course">Course</option>
                    <option value="exam">Exam</option>
                    <option value="td">TD</option>
                    <option value="summary">Summary</option>
                    <option value="link">Link</option>
                  </select>
                </div>
              </div>

              {postForm.education_type === 'university' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <select
                    value={postForm.subject_id}
                    onChange={(e) => setPostForm({ ...postForm, subject_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((s: Subject) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Subject *</label>
                  <select
                    value={postForm.school_subject_id}
                    onChange={(e) => setPostForm({ ...postForm, school_subject_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="">Select School Subject</option>
                    {schoolSubjects.map((s: SchoolSubject) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
                <input
                  type="url"
                  value={postForm.file_url}
                  onChange={(e) => setPostForm({ ...postForm, file_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="https://example.com/file.pdf"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Embed URL</label>
                <input
                  type="url"
                  value={postForm.embed_url}
                  onChange={(e) => setPostForm({ ...postForm, embed_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={postForm.published}
                  onChange={(e) => setPostForm({ ...postForm, published: e.target.checked })}
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">
                  Publish immediately
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowNewPostModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50"
                disabled={posting}
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                disabled={posting}
              >
                {posting ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

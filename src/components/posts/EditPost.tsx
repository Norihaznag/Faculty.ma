import React, { useState } from 'react';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { isSupabaseReady } from '../../lib/supabase';
import {
  updatePostSafe,
} from '../../lib/supabaseWithFallback';
import { Button, Card, TextInput, TextArea } from '../design-system';
import type { ContentType, Post } from '../../types';

interface EditPostProps {
  post: Post;
  onBack: () => void;
  onSave: () => void;
}

export function EditPost({ post, onBack, onSave }: EditPostProps): React.ReactNode {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: post.title,
    description: post.description,
    content_type: post.content_type,
    file_url: post.file_url || '',
    embed_url: post.embed_url || '',
    published: post.published,
  });

  const handleSubmit = async (): Promise<void> => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    setSaving(true);
    setError('');
    try {
      if (!isSupabaseReady()) {
        throw new Error('Supabase is not configured');
      }

      await updatePostSafe(post.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content_type: formData.content_type,
        file_url: formData.file_url || null,
        embed_url: formData.embed_url || null,
        published: formData.published,
      });

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-lg transition"
          title="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Post</h1>
          <p className="text-sm text-slate-600 mt-1">Modify post details and content</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-5">
          {error && (
            <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">Content Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['course', 'exam', 'td', 'summary', 'link'] as ContentType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData({ ...formData, content_type: type })}
                  className={`p-3 rounded-lg border-2 transition ${
                    formData.content_type === type
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-medium text-slate-900 capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>

          <TextInput
            label="Title"
            value={formData.title}
            onChange={(v) => setFormData({ ...formData, title: v })}
            placeholder="Post title"
            required
          />

          <TextArea
            label="Description"
            value={formData.description}
            onChange={(v) => setFormData({ ...formData, description: v })}
            placeholder="Describe the content..."
            rows={4}
            required
          />

          <TextInput
            label="File URL (PDF, Word, etc.)"
            type="url"
            value={formData.file_url}
            onChange={(v) => setFormData({ ...formData, file_url: v })}
            placeholder="https://..."
          />

          <TextInput
            label="Embed URL (Video, Presentation, etc.)"
            type="url"
            value={formData.embed_url}
            onChange={(v) => setFormData({ ...formData, embed_url: v })}
            placeholder="https://..."
          />

          <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300"
            />
            <div>
              <p className="font-medium text-slate-900">Publish immediately</p>
              <p className="text-xs text-slate-600">Make this post visible to users</p>
            </div>
          </label>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={onBack}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={saving}
              icon={Save}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

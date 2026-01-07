import React from 'react';
import { Download, ExternalLink, Calendar, User, FileText } from 'lucide-react';
import { Modal, Badge, Button } from '../design-system';
import type { Post } from '../../types';

interface PostPreviewModalProps {
  isOpen: boolean;
  post: Post | null;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PostPreviewModal({
  isOpen,
  post,
  onClose,
  onEdit,
  onDelete,
}: PostPreviewModalProps): React.ReactNode {
  if (!post) return null;

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(post.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Modal
      isOpen={isOpen}
      title={post.title}
      onClose={onClose}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          <Badge label={post.content_type} variant="primary" />
          <Badge
            label={post.published ? 'Published' : 'Draft'}
            variant={post.published ? 'success' : 'warning'}
          />
          <Badge
            label={post.education_type === 'university' ? 'University' : 'School'}
            variant="neutral"
          />
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-slate-600 font-medium mb-2">Description</p>
          <p className="text-slate-900 leading-relaxed whitespace-pre-wrap">
            {post.description}
          </p>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
          <div className="flex gap-3">
            <Calendar className="w-5 h-5 text-slate-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-600 font-medium">Created</p>
              <p className="text-sm text-slate-900">{formattedDate}</p>
              <p className="text-xs text-slate-600">{formattedTime}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <User className="w-5 h-5 text-slate-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-600 font-medium">Created By</p>
              <p className="text-sm text-slate-900 truncate">{post.created_by}</p>
            </div>
          </div>

          {post.updated_at && (
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-slate-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-600 font-medium">Last Updated</p>
                <p className="text-sm text-slate-900">
                  {new Date(post.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Files and Links */}
        <div className="space-y-3">
          {post.file_url && (
            <div className="p-4 border border-slate-200 rounded-lg">
              <p className="text-sm font-medium text-slate-900 mb-2">📎 Attachment</p>
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={() => window.open(post.file_url, '_blank')}
              >
                Download File
              </Button>
              <p className="text-xs text-slate-600 mt-2 truncate">{post.file_url}</p>
            </div>
          )}

          {post.embed_url && (
            <div className="p-4 border border-slate-200 rounded-lg">
              <p className="text-sm font-medium text-slate-900 mb-2">🎬 Embedded Content</p>
              <Button
                variant="secondary"
                size="sm"
                icon={ExternalLink}
                onClick={() => window.open(post.embed_url, '_blank')}
              >
                View External Link
              </Button>
              <p className="text-xs text-slate-600 mt-2 truncate">{post.embed_url}</p>
            </div>
          )}
        </div>

        {/* Post ID */}
        <div className="p-3 bg-slate-100 rounded-lg">
          <p className="text-xs text-slate-600 font-medium">Post ID</p>
          <p className="text-xs text-slate-900 font-mono mt-1 break-all">{post.id}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onEdit}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={onDelete}
            >
              Delete
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

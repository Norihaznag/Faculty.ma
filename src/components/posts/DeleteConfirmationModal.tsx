import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal, Button } from '../design-system';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  count?: number;
}

export function DeleteConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
  count = 1,
}: DeleteConfirmationModalProps): React.ReactNode {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      maxWidth="sm"
    >
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="p-3 bg-red-100 rounded-lg flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-slate-900 font-medium">{message}</p>
            {count > 1 && (
              <p className="text-sm text-slate-600 mt-2">
                This action will delete {count} items permanently.
              </p>
            )}
            <p className="text-sm text-slate-600 mt-2">This action cannot be undone.</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            loading={loading}
          >
            Delete {count > 1 ? `${count} items` : 'Item'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface FlexibleSelectProps {
  options: Array<{ id: string; name: string }>;
  value: string;
  onChange: (value: string) => void;
  onAddNew: (name: string) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function FlexibleSelect({
  options,
  value,
  onChange,
  onAddNew,
  placeholder = 'Select',
  disabled = false,
  loading = false,
}: FlexibleSelectProps): React.ReactNode {
  const [showNewInput, setShowNewInput] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [creatingNew, setCreatingNew] = useState(false);

  const handleCreateNew = async (): Promise<void> => {
    if (!newValue.trim()) {
      return;
    }
    
    setCreatingNew(true);
    try {
      await onAddNew(newValue.trim());
      setNewValue('');
      setShowNewInput(false);
    } catch (err) {
      console.error('Error creating new item:', err);
    } finally {
      setCreatingNew(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {showNewInput ? (
        <>
          <input
            type="text"
            value={newValue}
            onChange={(e) => {
              setNewValue(e.target.value);
            }}
            placeholder="Name"
            autoFocus
            disabled={creatingNew}
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateNew();
              if (e.key === 'Escape') {
                setShowNewInput(false);
                setNewValue('');
              }
            }}
          />
          <button
            onClick={handleCreateNew}
            disabled={creatingNew || !newValue.trim()}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add"
          >
            {creatingNew ? '...' : 'Add'}
          </button>
          <button
            onClick={() => {
              setShowNewInput(false);
              setNewValue('');
            }}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </>
      ) : (
        <>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all appearance-none cursor-pointer"
            disabled={disabled || loading}
          >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowNewInput(true)}
            disabled={disabled || loading}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add new"
          >
            <Plus className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}

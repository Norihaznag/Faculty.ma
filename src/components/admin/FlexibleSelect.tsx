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
  placeholder = 'Select or create',
  disabled = false,
  loading = false,
}: FlexibleSelectProps): React.ReactNode {
  const [showNewInput, setShowNewInput] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [creatingNew, setCreatingNew] = useState(false);

  const handleCreateNew = async (): Promise<void> => {
    if (!newValue.trim()) return;
    
    setCreatingNew(true);
    try {
      await onAddNew(newValue.trim());
      setNewValue('');
      setShowNewInput(false);
    } catch (error) {
      console.error('Error creating new item:', error);
      alert('Failed to create new item');
    } finally {
      setCreatingNew(false);
    }
  };

  return (
    <div className="flex gap-1">
      {showNewInput ? (
        <>
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Enter new item name"
            className="px-2 py-1 border border-gray-300 text-sm flex-1"
            disabled={creatingNew}
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
            className="px-2 py-1 bg-green-100 border border-green-300 text-green-800 text-sm hover:bg-green-200 disabled:opacity-50"
          >
            Add
          </button>
          <button
            onClick={() => {
              setShowNewInput(false);
              setNewValue('');
            }}
            className="px-2 py-1 bg-gray-100 border border-gray-300 text-gray-700 text-sm hover:bg-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </>
      ) : (
        <>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="px-2 py-1 border border-gray-300 text-sm flex-1"
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
            className="px-2 py-1 bg-blue-100 border border-blue-300 text-blue-800 text-sm hover:bg-blue-200 disabled:opacity-50"
            title="Add new item"
          >
            <Plus className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}

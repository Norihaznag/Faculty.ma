import React from 'react';

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  rows = 4,
}: TextAreaProps): React.ReactNode {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-900 mb-2">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`
          w-full px-4 py-2.5 rounded-lg
          border transition-colors duration-200
          focus:outline-none resize-none
          ${
            error
              ? 'border-red-300 focus:ring-2 focus:ring-red-200'
              : 'border-slate-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400'
          }
          disabled:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60
          text-slate-900 placeholder:text-slate-400
        `}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

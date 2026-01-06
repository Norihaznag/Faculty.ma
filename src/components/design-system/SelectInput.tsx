import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ id: string; name: string }>;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  error,
  required = false,
  disabled = false,
}: SelectInputProps): React.ReactNode {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-900 mb-2">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 rounded-lg
            border transition-colors duration-200
            appearance-none bg-white pr-10
            focus:outline-none
            ${
              error
                ? 'border-red-300 focus:ring-2 focus:ring-red-200'
                : 'border-slate-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400'
            }
            disabled:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60
            text-slate-900
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ id: string; name: string }>;
}

export function Select({ label, value, onChange, options }: SelectProps): React.ReactNode {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
        >
          <option value="">Sélectionner...</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

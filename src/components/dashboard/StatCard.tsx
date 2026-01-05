import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
}

export function StatCard({ icon: Icon, label, value }: StatCardProps): React.ReactNode {
  return (
    <div className="bg-gray-50 border border-gray-300 p-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-600 mb-1">{label}</div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    </div>
  );
}

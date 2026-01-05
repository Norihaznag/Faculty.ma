import React from 'react';

interface QuickActionProps {
  icon: React.ComponentType<{ className: string }>;
  title: string;
  description: string;
}

export function QuickAction({ icon: Icon, title, description }: QuickActionProps): React.ReactNode {
  return (
    <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition cursor-pointer">
      <div className="p-3 bg-indigo-100 rounded-lg">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

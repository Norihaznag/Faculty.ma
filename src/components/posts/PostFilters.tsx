import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '../design-system';

interface PostFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  contentType: string;
  onContentTypeChange: (type: string) => void;
  educationType: string;
  onEducationTypeChange: (type: string) => void;
  publishStatus: string;
  onPublishStatusChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function PostFilters({
  searchTerm,
  onSearchChange,
  contentType,
  onContentTypeChange,
  educationType,
  onEducationTypeChange,
  publishStatus,
  onPublishStatusChange,
  sortBy,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
}: PostFiltersProps): React.ReactNode {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Content Type</label>
          <select
            value={contentType}
            onChange={(e) => onContentTypeChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">All Types</option>
            <option value="course">Course</option>
            <option value="exam">Exam</option>
            <option value="td">TD</option>
            <option value="summary">Summary</option>
            <option value="link">Link</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Education Level</label>
          <select
            value={educationType}
            onChange={(e) => onEducationTypeChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">All Levels</option>
            <option value="university">University</option>
            <option value="school">School</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Publication Status</label>
          <select
            value={publishStatus}
            onChange={(e) => onPublishStatusChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="secondary"
            size="sm"
            icon={X}
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

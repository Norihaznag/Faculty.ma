import React from 'react';
import { BarChart3, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../design-system';
import type { Post } from '../../types';

interface PostStatsProps {
  posts: Post[];
}

export function PostStats({ posts }: PostStatsProps): React.ReactNode {
  const totalPosts = posts.length;
  const publishedPosts = posts.filter((p) => p.published).length;
  const draftPosts = posts.filter((p) => !p.published).length;
  
  const universityPosts = posts.filter((p) => p.education_type === 'university').length;
  const schoolPosts = posts.filter((p) => p.education_type === 'school').length;

  const contentTypeCounts = {
    course: posts.filter((p) => p.content_type === 'course').length,
    exam: posts.filter((p) => p.content_type === 'exam').length,
    td: posts.filter((p) => p.content_type === 'td').length,
    summary: posts.filter((p) => p.content_type === 'summary').length,
    link: posts.filter((p) => p.content_type === 'link').length,
  };

  const publishPercentage = totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0;

  const stats = [
    {
      icon: BookOpen,
      label: 'Total Posts',
      value: totalPosts,
      color: 'blue',
    },
    {
      icon: CheckCircle,
      label: 'Published',
      value: `${publishedPosts} (${publishPercentage}%)`,
      color: 'green',
    },
    {
      icon: Clock,
      label: 'Drafts',
      value: draftPosts,
      color: 'yellow',
    },
    {
      icon: BarChart3,
      label: 'University/School',
      value: `${universityPosts}/${schoolPosts}`,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600 border-blue-200',
            green: 'bg-green-50 text-green-600 border-green-200',
            yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
            purple: 'bg-purple-50 text-purple-600 border-purple-200',
          };

          return (
            <Card
              key={stat.label}
              className={`p-4 border ${colorClasses[stat.color as keyof typeof colorClasses]}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <Icon className="w-5 h-5 opacity-20" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Content Type Breakdown */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Content Type Breakdown</h3>
        <div className="space-y-3">
          {(Object.entries(contentTypeCounts) as Array<[keyof typeof contentTypeCounts, number]>).map(
            ([type, count]) => {
              const percentage =
                totalPosts > 0 ? Math.round((count / totalPosts) * 100) : 0;
              return (
                <div key={type}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700 capitalize">{type}</span>
                    <span className="text-xs font-medium text-slate-600">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      </Card>

      {/* Recent Activity */}
      {posts.length > 0 && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Posts</h3>
          <div className="space-y-2">
            {posts
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              )
              .slice(0, 5)
              .map((post) => (
                <div
                  key={post.id}
                  className="flex items-start justify-between p-3 bg-slate-50 rounded-lg text-sm"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 truncate">{post.title}</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {new Date(post.created_at).toLocaleDateString('en-US')}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      post.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}

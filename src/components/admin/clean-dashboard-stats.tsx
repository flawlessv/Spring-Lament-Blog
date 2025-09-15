/**
 * 简洁的仪表盘统计组件
 */

import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, FolderOpen, Tags, Eye } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  gradient: string;
}

function StatCard({
  title,
  value,
  icon,
  description,
  gradient,
}: StatCardProps) {
  return (
    <Card className="overflow-hidden relative hover:shadow-md">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`}
      />
      <CardContent className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient}`}>
                <div className="text-white">{icon}</div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {value.toLocaleString()}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

async function getStats() {
  try {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories,
      totalTags,
      totalViews,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.post.count({ where: { published: false } }),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.post.aggregate({ _sum: { views: true } }),
    ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories,
      totalTags,
      totalViews: totalViews._sum.views || 0,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalCategories: 0,
      totalTags: 0,
      totalViews: 0,
    };
  }
}

export default async function CleanDashboardStats() {
  const stats = await getStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="文章总数"
        value={stats.totalPosts}
        icon={<FileText className="h-5 w-5" />}
        description={`${stats.publishedPosts} 已发布，${stats.draftPosts} 草稿`}
        gradient="from-blue-500 to-blue-600"
      />

      <StatCard
        title="分类管理"
        value={stats.totalCategories}
        icon={<FolderOpen className="h-5 w-5" />}
        description="内容分类组织"
        gradient="from-green-500 to-emerald-600"
      />

      <StatCard
        title="标签系统"
        value={stats.totalTags}
        icon={<Tags className="h-5 w-5" />}
        description="内容标签标记"
        gradient="from-purple-500 to-purple-600"
      />

      <StatCard
        title="总浏览量"
        value={stats.totalViews}
        icon={<Eye className="h-5 w-5" />}
        description="累计访问次数"
        gradient="from-orange-500 to-red-500"
      />
    </div>
  );
}

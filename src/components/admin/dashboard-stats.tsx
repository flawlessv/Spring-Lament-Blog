/**
 * 仪表盘统计数据组件
 *
 * 显示博客系统的关键统计信息
 * 包括文章、分类、标签的数量统计
 */

import { prisma } from "@/lib/prisma";

/**
 * 统计卡片组件
 */
interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  description: string;
  color: "blue" | "green" | "purple" | "orange";
}

function StatCard({ title, value, icon, description, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    purple: "bg-purple-500 text-white",
    orange: "bg-orange-500 text-white",
  };

  const bgColorClasses = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    purple: "bg-purple-50",
    orange: "bg-orange-50",
  };

  return (
    <div className={`rounded-lg shadow p-6 ${bgColorClasses[color]}`}>
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${colorClasses[color]} rounded-lg p-3`}>
          <span className="text-2xl">{icon}</span>
        </div>

        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value.toLocaleString()}
              </div>
            </dd>
          </dl>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    </div>
  );
}

/**
 * 获取统计数据
 */
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
      // 总文章数
      prisma.post.count(),

      // 已发布文章数
      prisma.post.count({
        where: { published: true },
      }),

      // 草稿文章数
      prisma.post.count({
        where: { published: false },
      }),

      // 分类数
      prisma.category.count(),

      // 标签数
      prisma.tag.count(),

      // 总浏览量
      prisma.post.aggregate({
        _sum: { views: true },
      }),
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

export default async function DashboardStats() {
  const stats = await getStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="总文章数"
        value={stats.totalPosts}
        icon="📝"
        description={`${stats.publishedPosts} 已发布, ${stats.draftPosts} 草稿`}
        color="blue"
      />

      <StatCard
        title="分类数量"
        value={stats.totalCategories}
        icon="📁"
        description="文章分类管理"
        color="green"
      />

      <StatCard
        title="标签数量"
        value={stats.totalTags}
        icon="🏷️"
        description="文章标签管理"
        color="purple"
      />

      <StatCard
        title="总浏览量"
        value={stats.totalViews}
        icon="👁️"
        description="所有文章浏览数"
        color="orange"
      />
    </div>
  );
}

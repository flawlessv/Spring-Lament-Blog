/**
 * 简洁的仪表盘统计组件
 */

import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  FolderOpen,
  Tags,
  Eye,
  Clock,
  CheckCircle2,
  Star,
  BarChart3,
  Activity,
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Progress } from "@/components/ui/progress";

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
  description,
  icon,
  gradient,
}: Omit<StatCardProps, "trend">) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-lg hover:scale-[1.02] duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {value.toLocaleString()}
          </div>
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center shadow-lg`}
        >
          {icon}
        </div>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        {description}
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return "夜深了";
  if (hour < 9) return "早上好";
  if (hour < 12) return "上午好";
  if (hour < 14) return "中午好";
  if (hour < 18) return "下午好";
  if (hour < 22) return "晚上好";
  return "夜深了";
}

function calculateDays() {
  const now = new Date();
  const startDate = new Date("2025-09-30");
  const targetDate = new Date("2026-03-05");

  const daysSinceStart = Math.floor(
    (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysUntilTarget = Math.floor(
    (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return { daysSinceStart, daysUntilTarget };
}

async function getStats() {
  try {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      featuredPosts,
      totalCategories,
      totalTags,
      totalViews,
      recentPosts,
      topViewedPosts,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.post.count({ where: { published: false } }),
      prisma.post.count({ where: { featured: true } }),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.post.aggregate({ _sum: { views: true } }),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
          published: true,
          views: true,
        },
      }),
      prisma.post.findMany({
        take: 5,
        orderBy: { views: "desc" },
        where: { published: true },
        select: {
          id: true,
          title: true,
          views: true,
        },
      }),
    ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      featuredPosts,
      totalCategories,
      totalTags,
      totalViews: totalViews._sum.views || 0,
      recentPosts,
      topViewedPosts,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      featuredPosts: 0,
      totalCategories: 0,
      totalTags: 0,
      totalViews: 0,
      recentPosts: [],
      topViewedPosts: [],
    };
  }
}

async function getUserInfo(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      return { displayName: "博主", username: "user" };
    }

    return {
      displayName: user.profile?.displayName || user.username,
      username: user.username,
    };
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    return { displayName: "博主", username: "user" };
  }
}

export default async function CleanDashboardStats() {
  const stats = await getStats();
  const session = await getServerSession(authOptions);
  const { daysSinceStart, daysUntilTarget } = calculateDays();
  const greeting = getGreeting();

  // 从数据库获取用户信息，确保获取到正确的displayName
  let displayName = "博主";
  if (session?.user?.id) {
    const userInfo = await getUserInfo(session.user.id);
    displayName = userInfo.displayName;
  }

  // 计算发布率
  const publishRate =
    stats.totalPosts > 0
      ? Math.round((stats.publishedPosts / stats.totalPosts) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* 欢迎信息卡片 */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">
              {greeting}，{displayName} 👋
            </h2>
            <p className="text-purple-100 text-lg mb-6">欢迎回到你的创作空间</p>

            <div className="grid grid-cols-2 gap-6 max-w-md">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="h-5 w-5" />
                  <span className="text-sm font-medium">已坚持</span>
                </div>
                <div className="text-3xl font-bold">{daysSinceStart}</div>
                <div className="text-xs text-purple-100 mt-1">天</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-medium">距离目标</span>
                </div>
                <div className="text-3xl font-bold">{daysUntilTarget}</div>
                <div className="text-xs text-purple-100 mt-1">天</div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BarChart3 className="h-16 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* 核心数据统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="全部文章"
          value={stats.totalPosts}
          description={`${stats.publishedPosts} 已发布 · ${stats.draftPosts} 草稿`}
          icon={<FileText className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />

        <StatCard
          title="总浏览量"
          value={stats.totalViews}
          description="所有文章的浏览次数"
          icon={<Eye className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-br from-green-500 to-emerald-600"
        />

        <StatCard
          title="分类"
          value={stats.totalCategories}
          description="内容分类数量"
          icon={<FolderOpen className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />

        <StatCard
          title="标签"
          value={stats.totalTags}
          description="文章标签数量"
          icon={<Tags className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-br from-orange-500 to-pink-600"
        />
      </div>

      {/* 发布进度和精选文章 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 发布进度 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              发布进度
            </h3>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  已发布文章
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {stats.publishedPosts} / {stats.totalPosts}
                </span>
              </div>
              <Progress value={publishRate} className="h-2" />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {publishRate}% 完成
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.publishedPosts}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  已发布
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.draftPosts}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  草稿
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.featuredPosts}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  精选
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 快速统计 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              内容概览
            </h3>
            <Star className="h-5 w-5 text-yellow-500" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  平均浏览量
                </span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {stats.publishedPosts > 0
                  ? Math.round(stats.totalViews / stats.publishedPosts)
                  : 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <FolderOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  每分类文章数
                </span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {stats.totalCategories > 0
                  ? Math.round(stats.totalPosts / stats.totalCategories)
                  : 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Tags className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  每文章标签数
                </span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {stats.totalPosts > 0
                  ? (stats.totalTags / stats.totalPosts).toFixed(1)
                  : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 最近文章和热门文章 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近文章 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            最近文章
          </h3>
          <div className="space-y-3">
            {stats.recentPosts.length > 0 ? (
              stats.recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {post.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {post.views}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                暂无文章
              </div>
            )}
          </div>
        </div>

        {/* 热门文章 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            热门文章
          </h3>
          <div className="space-y-3">
            {stats.topViewedPosts.length > 0 ? (
              stats.topViewedPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      index === 0
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                        : index === 1
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          : index === 2
                            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                            : "bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {post.title}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    <Eye className="h-4 w-4" />
                    <span>{post.views.toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                暂无数据
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

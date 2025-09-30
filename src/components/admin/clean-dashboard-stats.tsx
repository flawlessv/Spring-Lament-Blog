/**
 * 简洁的仪表盘统计组件
 */

import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, FolderOpen, Tags, Calendar, TrendingUp } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
}: Omit<StatCardProps, "icon" | "gradient">) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="text-sm text-gray-500 mb-3">{title}</div>
      <div className="text-4xl font-bold text-gray-900 mb-2">
        {value.toLocaleString()}
      </div>
      <div className="text-sm text-gray-400">{description}</div>
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
  const session = await getServerSession(authOptions);
  const { daysSinceStart, daysUntilTarget } = calculateDays();
  const greeting = getGreeting();

  const displayName =
    session?.user?.displayName || session?.user?.username || "博主";

  return (
    <div className="space-y-8">
      {/* 欢迎信息 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {greeting}，{displayName}
        </h2>
        <p className="text-gray-500">
          已坚持{" "}
          <span className="font-semibold text-gray-900">{daysSinceStart}</span>{" "}
          天 · 距离目标还有{" "}
          <span className="font-semibold text-gray-900">{daysUntilTarget}</span>{" "}
          天
        </p>
      </div>

      {/* 数据统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="全部文章"
          value={stats.totalPosts}
          description={`${stats.publishedPosts} 已发布 · ${stats.draftPosts} 草稿`}
        />

        <StatCard
          title="已发布"
          value={stats.publishedPosts}
          description="公开可见的文章"
        />

        <StatCard
          title="分类"
          value={stats.totalCategories}
          description="内容分类数量"
        />

        <StatCard
          title="标签"
          value={stats.totalTags}
          description="文章标签数量"
        />
      </div>
    </div>
  );
}

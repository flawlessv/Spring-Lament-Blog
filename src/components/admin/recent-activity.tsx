/**
 * 仪表盘最近活动组件
 *
 * 显示最近的文章更新和系统活动
 */

import { prisma } from "@/lib/prisma";
import Link from "next/link";

/**
 * 活动项组件
 */
interface ActivityItemProps {
  type: "post" | "category" | "tag";
  title: string;
  href: string;
  time: string;
  status?: "published" | "draft" | "updated";
}

function ActivityItem({ type, title, href, time, status }: ActivityItemProps) {
  const typeIcons = {
    post: "📝",
    category: "📁",
    tag: "🏷️",
  };

  const statusColors = {
    published: "text-green-600 bg-green-100",
    draft: "text-yellow-600 bg-yellow-100",
    updated: "text-blue-600 bg-blue-100",
  };

  return (
    <div className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-shrink-0">
        <span className="text-lg">{typeIcons[type]}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <Link
            href={href as any}
            className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate"
          >
            {title}
          </Link>
          {status && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}
            >
              {status === "published" && "已发布"}
              {status === "draft" && "草稿"}
              {status === "updated" && "已更新"}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}

/**
 * 获取最近活动数据
 */
async function getRecentActivity() {
  try {
    // 获取最近更新的文章
    const recentPosts = await prisma.post.findMany({
      take: 10,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    // 格式化活动数据
    const activities = recentPosts.map((post) => {
      return {
        type: "post" as const,
        title: post.title,
        href: `/admin/posts/${post.id}`,
        time: formatRelativeTime(post.updatedAt),
        status: post.published ? ("published" as const) : ("draft" as const),
      };
    });

    return activities.slice(0, 8); // 只显示前8条
  } catch (error) {
    console.error("Failed to fetch recent activity:", error);
    return [];
  }
}

/**
 * 格式化相对时间
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "刚刚";
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} 分钟前`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} 小时前`;
  } else if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)} 天前`;
  } else {
    return date.toLocaleDateString("zh-CN");
  }
}

export default async function RecentActivity() {
  const activities = await getRecentActivity();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">最近活动</h2>
        <Link
          href={"/admin/posts" as any}
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          查看全部
        </Link>
      </div>

      <div className="space-y-0">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <ActivityItem key={index} {...activity} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-2 block">📭</span>
            <p>暂无最近活动</p>
            <Link
              href={"/admin/posts/new" as any}
              className="text-blue-600 hover:text-blue-500 text-sm mt-2 inline-block"
            >
              创建第一篇文章
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

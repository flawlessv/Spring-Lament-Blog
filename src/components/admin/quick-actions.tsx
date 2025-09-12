"use client";

/**
 * 仪表盘快捷操作组件
 *
 * 提供常用的管理操作快捷入口
 */

import Link from "next/link";

interface QuickActionProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  color: "blue" | "green" | "purple" | "orange";
}

function QuickAction({
  href,
  icon,
  title,
  description,
  color,
}: QuickActionProps) {
  const colorClasses = {
    blue: "border-blue-200 hover:border-blue-300 hover:bg-blue-50",
    green: "border-green-200 hover:border-green-300 hover:bg-green-50",
    purple: "border-purple-200 hover:border-purple-300 hover:bg-purple-50",
    orange: "border-orange-200 hover:border-orange-300 hover:bg-orange-50",
  };

  const iconColorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  };

  return (
    <Link
      href={href as any}
      className={`block p-4 rounded-lg border-2 transition-colors ${colorClasses[color]}`}
    >
      <div className="flex items-center">
        <span className={`text-2xl mr-3 ${iconColorClasses[color]}`}>
          {icon}
        </span>
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default function QuickActions() {
  const actions = [
    {
      href: "/admin/posts/new",
      icon: "✏️",
      title: "写新文章",
      description: "创建新的博客文章",
      color: "blue" as const,
    },
    {
      href: "/admin/posts",
      icon: "📋",
      title: "管理文章",
      description: "查看和编辑已有文章",
      color: "green" as const,
    },
    {
      href: "/admin/categories",
      icon: "📁",
      title: "管理分类",
      description: "添加和编辑文章分类",
      color: "purple" as const,
    },
    {
      href: "/admin/tags",
      icon: "🏷️",
      title: "管理标签",
      description: "添加和编辑文章标签",
      color: "orange" as const,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">快捷操作</h2>

      <div className="grid grid-cols-1 gap-4">
        {actions.map((action) => (
          <QuickAction key={action.href} {...action} />
        ))}
      </div>
    </div>
  );
}

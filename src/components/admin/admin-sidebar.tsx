"use client";

/**
 * 管理员后台侧边栏导航组件
 *
 * 使用 lucide-react 图标和 Tailwind CSS 提供主要导航功能
 * 包括文章管理、分类管理、标签管理等
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tags,
  Settings,
  PenTool,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
}

/**
 * 导航项组件
 */
function NavItem({ href, icon, children, isActive }: NavItemProps) {
  return (
    <Link
      href={href as any}
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <span className="mr-3 h-4 w-4">{icon}</span>
      {children}
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();

  /**
   * 主导航菜单配置
   */
  const mainNavItems = [
    {
      href: "/admin",
      icon: <LayoutDashboard />,
      label: "仪表盘",
      exact: true,
    },
    {
      href: "/admin/posts",
      icon: <FileText />,
      label: "文章管理",
    },
    {
      href: "/admin/categories",
      icon: <FolderOpen />,
      label: "分类管理",
    },
    {
      href: "/admin/tags",
      icon: <Tags />,
      label: "标签管理",
    },
    {
      href: "/admin/settings",
      icon: <Settings />,
      label: "系统设置",
    },
  ];

  /**
   * 快捷操作菜单配置
   */
  const quickActionItems = [
    {
      href: "/admin/posts/new",
      icon: <PenTool />,
      label: "写新文章",
    },
    {
      href: "/admin/categories/new",
      icon: <Plus />,
      label: "新建分类",
    },
    {
      href: "/admin/tags/new",
      icon: <Plus />,
      label: "新建标签",
    },
  ];

  /**
   * 检查导航项是否激活
   */
  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background border-r border-border overflow-y-auto">
      <nav className="p-4 space-y-2">
        {/* 主导航 */}
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              isActive={isActive(item.href, item.exact)}
            >
              {item.label}
            </NavItem>
          ))}
        </div>

        {/* 分隔线 */}
        <div className="py-4">
          <div className="border-t border-border"></div>
        </div>

        {/* 快捷操作 */}
        <div className="space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            快捷操作
          </div>

          {quickActionItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              isActive={isActive(item.href)}
            >
              {item.label}
            </NavItem>
          ))}
        </div>

        {/* 底部统计信息 */}
        <div className="mt-8 pt-4 border-t border-border">
          <div className="px-3 py-2 text-xs text-muted-foreground">
            <div className="space-y-1">
              <div>文章: --</div>
              <div>分类: --</div>
              <div>标签: --</div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}

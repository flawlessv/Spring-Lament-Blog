"use client";

/**
 * 简洁的管理后台布局
 *
 * 去除不必要的功能，专注于核心内容管理
 */

import { ReactNode, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tags,
  Settings,
  ExternalLink,
  LogOut,
  User,
  Menu,
  X,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CleanAdminLayoutProps {
  children: ReactNode;
}

export default function CleanAdminLayout({ children }: CleanAdminLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      name: "仪表盘",
      href: "/admin",
      icon: LayoutDashboard,
      current: pathname === "/admin",
    },
    {
      name: "文章管理",
      href: "/admin/posts",
      icon: FileText,
      current: pathname?.startsWith("/admin/posts"),
    },
    {
      name: "分类管理",
      href: "/admin/categories",
      icon: FolderOpen,
      current: pathname?.startsWith("/admin/categories"),
    },
    {
      name: "标签管理",
      href: "/admin/tags",
      icon: Tags,
      current: pathname?.startsWith("/admin/tags"),
    },
    {
      name: "系统设置",
      href: "/admin/settings",
      icon: Settings,
      current: pathname?.startsWith("/admin/settings"),
    },
  ];

  const handleSignOut = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 z-50">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between">
          {/* 左侧 */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Home className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  SpringLament
                </h1>
                <p className="text-xs text-gray-500 -mt-1">管理后台</p>
              </div>
            </div>
          </div>

          {/* 右侧 */}
          <div className="flex items-center space-x-3">
            <Link href="/" target="_blank">
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">查看前台</span>
              </Button>
            </Link>

            {session?.user && (
              <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {session.user.displayName || session.user.username}
                  </div>
                  <div className="text-xs text-gray-500">管理员</div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 侧边栏 */}
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/90 backdrop-blur-lg border-r border-gray-200/50 transform transition-transform duration-200 ease-in-out z-40",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* 导航菜单 */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href as any}>
                    <div
                      className={cn(
                        "flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                        item.current
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      )}
                    >
                      <Icon
                        className={cn(
                          "mr-3 h-5 w-5",
                          item.current ? "text-white" : "text-gray-400"
                        )}
                      />
                      <span className="flex-1">{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>

      {/* 遮罩层 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 主内容区 */}
      <main className="lg:ml-64 mt-16 min-h-[calc(100vh-4rem)]">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}

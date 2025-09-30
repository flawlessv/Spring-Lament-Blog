"use client";

/**
 * 简洁的管理后台布局
 *
 * 去除不必要的功能，专注于核心内容管理
 */

import { ReactNode, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tags,
  ExternalLink,
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading";

interface CleanAdminLayoutProps {
  children: ReactNode;
}

export default function CleanAdminLayout({ children }: CleanAdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 简单的权限检查 - 只检查是否登录
  useEffect(() => {
    if (status === "loading") return; // 还在加载中，等待

    if (status === "unauthenticated") {
      // 未登录，重定向到登录页
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
  }, [status, router, pathname]);

  // 显示加载状态
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // 未登录
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">请先登录</h1>
          <p className="text-gray-600 mb-4">您需要登录才能访问管理后台</p>
          <Button onClick={() => router.push("/login")}>前往登录</Button>
        </div>
      </div>
    );
  }

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
      name: "个人信息",
      href: "/admin/profile",
      icon: User,
      current: pathname?.startsWith("/admin/profile"),
    },
  ];

  const handleSignOut = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="h-full px-6 flex items-center justify-between">
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
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-sm">
                <Sparkles className="h-4 w-4 text-white" />
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
          <div className="flex items-center space-x-4">
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm">
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
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
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
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out z-40",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* 导航菜单 */}
          <nav className="flex-1 px-4 py-8">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href as any}>
                    <div
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                        item.current
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      )}
                    >
                      <Icon
                        className={cn(
                          "mr-3 h-5 w-5",
                          item.current ? "text-white" : "text-gray-500"
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
        <div className="p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}

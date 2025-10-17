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
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  // 获取用户头像
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch("/api/admin/profile");
        if (response.ok) {
          const data = await response.json();
          setAvatarUrl(data.profile?.avatar || "");
        }
      } catch (error) {
        console.error("获取头像失败:", error);
      }
    };

    if (status === "authenticated") {
      fetchAvatar();
    }
  }, [status]);

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
    <div className="min-h-screen bg-gray-50/50">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-b border-gray-200/80 z-50">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          {/* 左侧 */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden h-9 w-9 p-0"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-semibold text-gray-900">
                  SpringLament
                </h1>
                <span className="text-sm text-gray-400">|</span>
                <p className="text-sm text-gray-500">管理后台</p>
              </div>
            </div>
          </div>

          {/* 右侧 */}
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0"
                title="返回首页"
              >
                <ExternalLink className="h-4 w-4 text-gray-600" />
              </Button>
            </Link>

            {session?.user && (
              <div className="group relative">
                {/* 头像 */}
                <div className="cursor-pointer">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={session.user.displayName || session.user.username}
                      className="w-9 h-9 rounded-full object-cover border-2 border-gray-200 group-hover:border-purple-400 transition-all shadow-sm"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-sm border-2 border-gray-200 group-hover:border-purple-400 transition-all">
                      <User className="h-4.5 w-4.5 text-white" />
                    </div>
                  )}
                </div>

                {/* 下拉菜单 */}
                <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:top-11 transition-all duration-200">
                  <div className="py-2">
                    {/* 用户信息 */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">
                        {session.user.displayName || session.user.username}
                      </div>
                      <div className="text-xs text-gray-500">管理员</div>
                    </div>

                    {/* 菜单项 */}
                    <Link href="/" target="_blank">
                      <div className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                        <ExternalLink className="h-4 w-4 mr-3 text-gray-400" />
                        <span>查看前台</span>
                      </div>
                    </Link>

                    <div
                      onClick={handleSignOut}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-3 text-gray-400" />
                      <span>退出登录</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="lg:hidden h-9 w-9 p-0"
            >
              <Sparkles className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

      {/* 侧边栏 */}
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-56 bg-white border-r border-gray-200/80 transform transition-transform duration-200 ease-in-out z-40",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* 导航菜单 */}
          <nav className="flex-1 px-3 py-6">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href as any}>
                    <div
                      className={cn(
                        "group flex items-center px-3 py-3 text-[15px] font-medium rounded-lg transition-all duration-200",
                        item.current
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-200"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <Icon
                        className={cn(
                          "mr-3 h-5 w-5 transition-transform",
                          item.current
                            ? "text-white"
                            : "text-gray-400 group-hover:text-gray-600 group-hover:scale-110"
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
      <main className="lg:ml-56 mt-16 min-h-[calc(100vh-4rem)]">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

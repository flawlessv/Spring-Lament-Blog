"use client";

/**
 * 管理员后台顶部导航栏组件
 *
 * 使用 shadcn/ui 组件和 lucide-react 图标
 * 显示网站标题、用户信息和登出功能
 */

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { ExternalLink, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminHeader() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /**
   * 处理用户登出
   */
  const handleSignOut = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/", // 登出后重定向到首页
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* 左侧：网站标题和后台标识 */}
        <div className="flex items-center space-x-4">
          <Link
            href="/admin"
            className="text-xl font-bold text-foreground hover:text-primary transition-colors no-underline"
          >
            SpringLament Blog
          </Link>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-2"></div>
            <span className="text-sm text-muted-foreground">管理后台</span>
          </div>
        </div>

        {/* 右侧：用户信息和操作 */}
        <div className="flex items-center space-x-4">
          {/* 查看前台按钮 */}
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="/"
              target="_blank"
              className="flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>查看前台</span>
            </Link>
          </Button>

          {/* 用户信息 */}
          {session?.user && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md transition-colors"
              >
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium">
                    {session.user.displayName || session.user.username}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {session.user.role === "ADMIN" ? "管理员" : "用户"}
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isDropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {/* 下拉菜单 */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-md z-50">
                  <div className="p-2">
                    <div className="px-2 py-1.5 text-sm text-muted-foreground border-b border-border mb-1">
                      <div className="font-medium text-foreground">
                        {session.user.displayName || session.user.username}
                      </div>
                      <div className="text-xs">
                        {session.user.role === "ADMIN" ? "管理员" : "用户"}
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 w-full px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>退出登录</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 点击外部关闭下拉菜单 */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
}

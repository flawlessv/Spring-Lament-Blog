"use client";

/**
 * 管理员后台布局组件
 *
 * 使用 shadcn/ui 和 Tailwind CSS 重新设计
 * 包括导航栏、侧边栏、用户信息和登出功能
 */

import { ReactNode } from "react";
import AdminHeader from "./admin-header";
import AdminSidebar from "./admin-sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航栏 */}
      <AdminHeader />

      <div className="flex">
        {/* 侧边栏 */}
        <AdminSidebar />

        {/* 主内容区域 */}
        <main className="flex-1 ml-64 mt-16">
          <div className="p-6">
            <div className="bg-card rounded-lg shadow-sm border p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

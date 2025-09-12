/**
 * 管理员仪表盘页面
 *
 * 显示博客系统的概览信息和快捷操作
 * 包括文章、分类、标签的统计数据
 */

import { Suspense } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import DashboardStats from "@/components/admin/dashboard-stats";
import QuickActions from "@/components/admin/quick-actions";
import RecentActivity from "@/components/admin/recent-activity";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
          <p className="mt-1 text-sm text-gray-500">
            欢迎来到 SpringLament Blog 管理后台
          </p>
        </div>

        {/* 统计卡片 */}
        <Suspense fallback={<StatsLoadingSkeleton />}>
          <DashboardStats />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 快捷操作 */}
          <QuickActions />

          {/* 最近活动 */}
          <Suspense fallback={<ActivityLoadingSkeleton />}>
            <RecentActivity />
          </Suspense>
        </div>
      </div>
    </AdminLayout>
  );
}

/**
 * 统计数据加载骨架屏
 */
function StatsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 活动数据加载骨架屏
 */
function ActivityLoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

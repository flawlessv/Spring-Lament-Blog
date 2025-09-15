/**
 * 简洁的管理员仪表盘页面
 *
 * 专注于核心数据展示，去除不必要的功能
 */

import { Suspense } from "react";
import CleanAdminLayout from "@/components/admin/clean-admin-layout";
import CleanDashboardStats from "@/components/admin/clean-dashboard-stats";
import { LoadingSpinner } from "@/components/ui/loading";

export default function AdminDashboard() {
  return (
    <CleanAdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">管理概览</h1>
          <p className="mt-1 text-gray-600">内容管理中心</p>
        </div>

        {/* 统计卡片 */}
        <Suspense fallback={<LoadingSpinner />}>
          <CleanDashboardStats />
        </Suspense>
      </div>
    </CleanAdminLayout>
  );
}

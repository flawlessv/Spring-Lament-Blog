"use client";

/**
 * 文章管理页面
 *
 * 提供文章的创建、编辑、删除和批量操作功能
 * 包括筛选、搜索和分页功能
 */

import { useState } from "react";
import CleanAdminLayout from "@/components/admin/clean-admin-layout";
import UnifiedPostsTable from "@/components/admin/unified-posts-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleBatchAction = (action: string, ids: string[]) => {
    console.log("批量操作:", action, ids);
    // TODO: 实现批量操作功能
  };

  return (
    <CleanAdminLayout>
      <div className="space-y-4">
        {/* 页面标题 */}
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
          <h1 className="text-xl font-semibold text-gray-900">文章管理</h1>
        </div>

        {/* 文章列表 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <UnifiedPostsTable
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
            onSelectionChange={setSelectedIds}
          />
        </div>
      </div>
    </CleanAdminLayout>
  );
}

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
      <div className="space-y-8">
        {/* 页面头部 */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4">
            <Plus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            文章管理
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            管理您的博客文章，支持创建、编辑和发布，让内容管理更加高效
          </p>
        </div>

        {/* 文章列表 */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
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

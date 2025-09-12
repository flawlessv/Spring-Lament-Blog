"use client";

/**
 * 文章管理页面
 *
 * 提供文章的创建、编辑、删除和批量操作功能
 * 包括筛选、搜索和分页功能
 */

import { useState } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import PostsTable from "@/components/admin/posts-table";
import PostsHeader from "@/components/admin/posts-header";
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
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">文章管理</h1>
            <p className="text-muted-foreground">
              管理您的博客文章，支持创建、编辑和发布
            </p>
          </div>
          <Button asChild>
            <Link
              href="/admin/posts/new"
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>新建文章</span>
            </Link>
          </Button>
        </div>

        {/* 筛选和搜索 */}
        <PostsHeader
          onSearch={setSearchQuery}
          onStatusFilter={setStatusFilter}
          onCategoryFilter={setCategoryFilter}
          onBatchAction={handleBatchAction}
          selectedCount={selectedIds.length}
        />

        {/* 文章列表 */}
        <PostsTable
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          categoryFilter={categoryFilter}
          onSelectionChange={setSelectedIds}
        />
      </div>
    </AdminLayout>
  );
}

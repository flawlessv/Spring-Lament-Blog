"use client";

/**
 * 分类管理页面
 *
 * 提供分类的创建、编辑、删除和管理功能
 */

import { useState } from "react";
import CleanAdminLayout from "@/components/admin/clean-admin-layout";
import UnifiedCategoriesTable from "@/components/admin/unified-categories-table";
import CategoryDialog from "@/components/admin/category-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CategoriesPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const handleCreate = () => {
    setEditingCategory(null);
    setShowDialog(true);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingCategory(null);
  };

  return (
    <CleanAdminLayout>
      <div className="space-y-8">
        {/* 页面头部 */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-4">
            <Plus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            分类管理
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            管理博客分类，为文章提供清晰的组织结构，帮助读者快速找到感兴趣的内容
          </p>
        </div>

        {/* 分类列表 */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
          <UnifiedCategoriesTable onEdit={handleEdit} />
        </div>

        {/* 创建/编辑对话框 */}
        <CategoryDialog
          open={showDialog}
          onClose={handleCloseDialog}
          category={editingCategory}
        />
      </div>
    </CleanAdminLayout>
  );
}

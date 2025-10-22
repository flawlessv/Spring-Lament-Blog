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

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  sortOrder: number;
}

export default function CategoriesPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowDialog(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingCategory(null);
  };

  return (
    <CleanAdminLayout>
      <div className="space-y-4">
        {/* 页面标题 */}
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
          <h1 className="text-xl font-semibold text-gray-900">分类管理</h1>
        </div>

        {/* 分类列表 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <UnifiedCategoriesTable onEdit={handleEdit} onCreate={handleCreate} />
        </div>
      </div>

      {/* 创建/编辑对话框 */}
      <CategoryDialog
        open={showDialog}
        onClose={handleCloseDialog}
        category={editingCategory}
      />
    </CleanAdminLayout>
  );
}

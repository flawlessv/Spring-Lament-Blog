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
      <div className="space-y-4">
        {/* 页面标题 */}
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
          <h1 className="text-xl font-semibold text-gray-900">分类管理</h1>
        </div>

        {/* 分类列表 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <UnifiedCategoriesTable onEdit={handleEdit} />
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

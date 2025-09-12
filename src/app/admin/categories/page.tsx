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
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">分类管理</h2>
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

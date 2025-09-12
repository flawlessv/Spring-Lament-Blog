"use client";

/**
 * 分类管理页面
 *
 * 提供分类的创建、编辑、删除和管理功能
 */

import { useState } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import CategoriesTable from "@/components/admin/categories-table";
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
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">分类管理</h1>
            <p className="text-muted-foreground">
              管理博客分类，组织您的文章内容
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            新建分类
          </Button>
        </div>

        {/* 分类列表 */}
        <CategoriesTable onEdit={handleEdit} />

        {/* 创建/编辑对话框 */}
        <CategoryDialog
          open={showDialog}
          onClose={handleCloseDialog}
          category={editingCategory}
        />
      </div>
    </AdminLayout>
  );
}

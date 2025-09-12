"use client";

/**
 * 标签管理页面
 *
 * 提供标签的创建、编辑、删除和管理功能
 */

import { useState } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import TagsTable from "@/components/admin/tags-table";
import TagDialog from "@/components/admin/tag-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TagsPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);

  const handleCreate = () => {
    setEditingTag(null);
    setShowDialog(true);
  };

  const handleEdit = (tag: any) => {
    setEditingTag(tag);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingTag(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">标签管理</h1>
            <p className="text-muted-foreground">
              管理博客标签，为文章添加细粒度分类
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            新建标签
          </Button>
        </div>

        {/* 标签列表 */}
        <TagsTable onEdit={handleEdit} />

        {/* 创建/编辑对话框 */}
        <TagDialog
          open={showDialog}
          onClose={handleCloseDialog}
          tag={editingTag}
        />
      </div>
    </AdminLayout>
  );
}

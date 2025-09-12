"use client";

/**
 * 标签管理页面
 *
 * 提供标签的创建、编辑、删除和管理功能
 */

import { useState } from "react";
import CleanAdminLayout from "@/components/admin/clean-admin-layout";
import UnifiedTagsTable from "@/components/admin/unified-tags-table";
import TagDialog from "@/components/admin/tag-dialog";
import { ModernButton } from "@/components/ui/modern-button";
import { Plus, Tags } from "lucide-react";

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
    <CleanAdminLayout>
      <div className="space-y-8">
        {/* 页面头部 */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Tags className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            标签管理
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            管理博客标签，为文章添加细粒度分类，帮助读者更好地发现相关内容
          </p>
        </div>

        {/* 标签列表 */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
          <UnifiedTagsTable onEdit={handleEdit} />
        </div>

        {/* 创建/编辑对话框 */}
        <TagDialog
          open={showDialog}
          onClose={handleCloseDialog}
          tag={editingTag}
        />
      </div>
    </CleanAdminLayout>
  );
}

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
import { Button } from "@/components/ui/button";
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
      <div className="space-y-4">
        {/* 页面标题 */}
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
          <h1 className="text-xl font-semibold text-gray-900">标签管理</h1>
        </div>

        {/* 标签列表 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <UnifiedTagsTable onEdit={handleEdit} />
        </div>
      </div>

      {/* 创建/编辑对话框 */}
      <TagDialog
        open={showDialog}
        onClose={handleCloseDialog}
        tag={editingTag}
      />
    </CleanAdminLayout>
  );
}

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
      <div className="space-y-8">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">标签管理</h2>
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

"use client";

/**
 * 统一风格的标签管理表格
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Edit, Trash2, Tags, FileText, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ModernTable } from "@/components/ui/modern-table";
import { useToast } from "@/hooks/use-toast";

interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  description?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: {
    posts: number;
  };
}

interface UnifiedTagsTableProps {
  onEdit?: (tag: Tag) => void;
}

export default function UnifiedTagsTable({ onEdit }: UnifiedTagsTableProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { toast } = useToast();

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/tags");

      if (!response.ok) {
        throw new Error("获取标签数据失败");
      }

      const data = await response.json();
      setTags(data.tags || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误");
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "yyyy年MM月dd日", { locale: zhCN });
  };

  const handleDelete = async (tag: Tag) => {
    try {
      const response = await fetch(`/api/admin/tags/${tag.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "删除成功",
          description: `标签"${tag.name}"已成功删除`,
          variant: "success",
        });
        await fetchTags();
      } else {
        throw new Error("删除失败");
      }
    } catch (error) {
      toast({
        title: "删除失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    }
  };

  const handleBatchDelete = async (selectedIds: string[]) => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/admin/tags/${id}`, { method: "DELETE" })
        )
      );

      toast({
        title: "批量删除成功",
        description: `已删除 ${selectedIds.length} 个标签`,
        variant: "success",
      });

      setSelectedIds([]);
      await fetchTags();
    } catch (error) {
      toast({
        title: "批量删除失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    }
  };

  const columns = [
    {
      key: "name",
      title: "标签信息",
      width: "flex-1",
      render: (_, tag: Tag) => (
        <div className="flex items-center space-x-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: tag.color || "#6B7280" }}
          />
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <Badge
                style={{ backgroundColor: tag.color || "#6B7280" }}
                className="text-white font-medium rounded-lg"
              >
                {tag.name}
              </Badge>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              <code className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                {tag.slug}
              </code>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "posts",
      title: "文章数量",
      width: "w-24",
      className: "text-center",
      render: (_, tag: Tag) => (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <span className="font-medium text-gray-700">
            {tag._count?.posts || 0} 篇
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      title: "创建时间",
      width: "w-32",
      className: "text-center",
      render: (_, tag: Tag) => (
        <span className="text-sm text-gray-500">
          {formatDate(tag.createdAt)}
        </span>
      ),
    },
  ];

  const actions = [
    {
      key: "edit",
      label: "编辑",
      icon: <Edit className="h-4 w-4" />,
      onClick: (tag: Tag) => {
        onEdit?.(tag);
      },
    },
    {
      key: "delete",
      label: "删除",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: "danger" as const,
    },
  ];

  const batchActions = [
    {
      label: "批量删除",
      onClick: handleBatchDelete,
      variant: "danger" as const,
      icon: <Trash2 className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <ModernTable
      data={tags}
      columns={columns}
      loading={loading}
      error={error}
      searchable={true}
      searchPlaceholder="搜索标签名称..."
      selectable={true}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      actions={actions}
      createButton={{
        label: "新建标签",
        href: "/admin/tags/new",
        icon: <Plus className="mr-2 h-4 w-4" />,
      }}
      batchActions={batchActions}
      emptyIcon={<Tags className="h-10 w-10 text-gray-400" />}
      emptyTitle="暂无标签"
      emptyDescription="创建第一个标签来组织您的内容"
      getRecordId={(tag) => tag.id}
      onRetry={fetchTags}
    />
  );
}

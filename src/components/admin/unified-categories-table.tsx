"use client";

/**
 * 统一风格的分类管理表格
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  Edit,
  Trash2,
  FolderOpen,
  FileText,
  Plus,
  ArrowUpDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ModernTable } from "@/components/ui/modern-table";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
  description?: string;
  sortOrder: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: {
    posts: number;
  };
}

interface UnifiedCategoriesTableProps {
  onEdit?: (category: Category) => void;
}

export default function UnifiedCategoriesTable({
  onEdit,
}: UnifiedCategoriesTableProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/categories");

      if (!response.ok) {
        throw new Error("获取分类数据失败");
      }

      const data = await response.json();
      setCategories(data.categories || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "yyyy年MM月dd日", { locale: zhCN });
  };

  const handleDelete = async (category: Category) => {
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "删除成功",
          description: `分类"${category.name}"已成功删除`,
          variant: "success",
        });
        await fetchCategories();
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
          fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
        )
      );

      toast({
        title: "批量删除成功",
        description: `已删除 ${selectedIds.length} 个分类`,
        variant: "success",
      });

      setSelectedIds([]);
      await fetchCategories();
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
      title: "分类信息",
      width: "flex-1",
      render: (_, category: Category) => (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium"
              style={{ backgroundColor: category.color || "#6B7280" }}
            >
              {category.icon || "📁"}
            </div>
            <div className="min-w-0">
              <div className="font-medium text-gray-900">{category.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                <code className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                  {category.slug}
                </code>
              </div>
              {category.description && (
                <div className="text-sm text-gray-600 mt-1 line-clamp-1">
                  {category.description}
                </div>
              )}
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
      render: (_, category: Category) => (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-green-600" />
          </div>
          <span className="font-medium text-gray-700">
            {category._count?.posts || 0} 篇
          </span>
        </div>
      ),
    },
    {
      key: "sortOrder",
      title: "排序",
      width: "w-16",
      className: "text-center",
      render: (_, category: Category) => (
        <div className="flex items-center justify-center space-x-1 text-gray-600">
          <ArrowUpDown className="h-3 w-3" />
          <span className="text-sm font-mono">{category.sortOrder}</span>
        </div>
      ),
    },
    {
      key: "createdAt",
      title: "创建时间",
      width: "w-32",
      className: "text-center",
      render: (_, category: Category) => (
        <span className="text-sm text-gray-500">
          {formatDate(category.createdAt)}
        </span>
      ),
    },
  ];

  const actions = [
    {
      key: "edit",
      label: "编辑",
      icon: <Edit className="h-4 w-4" />,
      onClick: (category: Category) => {
        onEdit?.(category);
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
      data={categories}
      columns={columns}
      loading={loading}
      error={error}
      searchable={true}
      searchPlaceholder="搜索分类名称..."
      selectable={true}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      actions={actions}
      createButton={{
        label: "新建分类",
        href: "/admin/categories/new",
        icon: <Plus className="mr-2 h-4 w-4" />,
      }}
      batchActions={batchActions}
      emptyIcon={<FolderOpen className="h-10 w-10 text-gray-400" />}
      emptyTitle="暂无分类"
      emptyDescription="创建第一个分类来组织您的内容"
      getRecordId={(category) => category.id}
      onRetry={fetchCategories}
    />
  );
}

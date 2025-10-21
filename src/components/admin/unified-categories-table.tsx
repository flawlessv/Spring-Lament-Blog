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
import { Button } from "@/components/ui/button";
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
  stats?: {
    totalPosts: number;
    publishedPosts: number;
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
      // 添加 includeStats 参数以获取文章统计
      const response = await fetch("/api/admin/categories?includeStats=true");

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
      title: "分类名称",
      width: "w-56",
      render: (_: unknown, category: Category) => (
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium flex-shrink-0"
            style={{ backgroundColor: category.color || "#6B7280" }}
          >
            {category.icon || "📁"}
          </div>
          <div className="font-medium text-gray-900">{category.name}</div>
        </div>
      ),
    },
    {
      key: "slug",
      title: "URL",
      width: "w-40",
      render: (_: unknown, category: Category) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-600">
          {category.slug}
        </code>
      ),
    },
    {
      key: "description",
      title: "描述",
      width: "flex-1",
      render: (_: unknown, category: Category) => (
        <span className="text-sm text-gray-600 line-clamp-2">
          {category.description || <span className="text-gray-400">-</span>}
        </span>
      ),
    },
    {
      key: "posts",
      title: "文章数量",
      width: "w-24",
      className: "text-center",
      render: (_: unknown, category: Category) => (
        <div className="flex items-center justify-center space-x-1">
          <FileText className="h-4 w-4 text-green-600" />
          <span className="font-medium text-gray-900 text-sm">
            {category.stats?.totalPosts ?? 0}
          </span>
        </div>
      ),
    },
    {
      key: "sortOrder",
      title: "排序",
      width: "w-16",
      className: "text-center",
      render: (_: unknown, category: Category) => (
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
      render: (_: unknown, category: Category) => (
        <span className="text-sm text-gray-500">
          {formatDate(category.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      title: "操作",
      width: "w-24",
      className: "text-center",
      render: (_: unknown, category: Category) => (
        <div className="flex items-center justify-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => onEdit?.(category)}
            title="编辑"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleDelete(category)}
            title="删除"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
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

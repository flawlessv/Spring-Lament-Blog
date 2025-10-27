"use client";

/**
 * 统一风格的分类管理表格
 */

import { useState, useEffect } from "react";
import { Edit, Trash2, FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DraggableTable } from "@/components/ui/draggable-table";
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
  onCreate?: () => void;
}

export default function UnifiedCategoriesTable({
  onEdit,
  onCreate,
}: UnifiedCategoriesTableProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleDragReorder = async (newOrder: Category[]) => {
    try {
      // 批量更新排序
      const updatePromises = newOrder.map((category, index) =>
        fetch(`/api/admin/categories/${category.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sortOrder: index + 1,
          }),
        })
      );

      await Promise.all(updatePromises);

      toast({
        title: "排序更新成功",
        description: "分类排序已保存",
        variant: "success",
      });

      // 拖拽完成后刷新列表
      await fetchCategories();
    } catch (error) {
      toast({
        title: "排序更新失败",
        description: "请稍后重试",
        variant: "destructive",
      });
      // 重新获取数据以恢复正确状态
      await fetchCategories();
    }
  };

  return (
    <div className="space-y-6">
      {/* 搜索和操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="搜索分类名称..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => {
                // 这里可以实现搜索功能
                console.log("搜索:", e.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button className="flex items-center" onClick={onCreate}>
            <Plus className="mr-2 h-4 w-4" />
            新建分类
          </Button>
        </div>
      </div>

      {/* 拖拽排序表格 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Button onClick={fetchCategories} className="mt-4">
            重试
          </Button>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            暂无分类
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            开始创建您的第一个分类吧
          </p>
          <Button className="flex items-center mx-auto" onClick={onCreate}>
            <Plus className="mr-2 h-4 w-4" />
            新建分类
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <DraggableTable
            data={categories}
            onReorder={handleDragReorder}
            getRecordId={(category) => category.id}
            renderItem={(category) => (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600">
                <div className="p-4">
                  <div className="flex items-center space-x-4">
                    {/* 分类信息 */}
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-medium flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: category.color || "#6B7280" }}
                      >
                        {category.icon || "📁"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                          {category.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                          {category.slug}
                        </div>
                        {category.description && (
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">
                            {category.description}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 统计信息 */}
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          文章
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                          {category.stats?.totalPosts ?? 0}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          排序
                        </div>
                        <div className="font-semibold text-blue-600 dark:text-blue-400 text-lg">
                          {category.sortOrder}
                        </div>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit?.(category)}
                        className="h-9 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category)}
                        className="h-9 px-3 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}

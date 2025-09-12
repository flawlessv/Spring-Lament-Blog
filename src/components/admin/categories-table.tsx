"use client";

/**
 * 分类列表表格组件
 *
 * 显示分类列表，支持编辑、删除和排序
 */

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  Edit,
  Trash2,
  MoreHorizontal,
  FileText,
  RefreshCw,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 分类数据类型
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  sortOrder: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  stats?: {
    totalPosts: number;
    publishedPosts: number;
  };
}

// API 响应类型
interface CategoriesResponse {
  categories: Category[];
}

interface CategoriesTableProps {
  onEdit?: (category: Category) => void;
}

export default function CategoriesTable({ onEdit }: CategoriesTableProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取分类数据
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/categories?includeStats=true");

      if (!response.ok) {
        throw new Error("获取分类数据失败");
      }

      const data: CategoriesResponse = await response.json();
      setCategories(data.categories);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误");
      // 如果API失败，使用模拟数据
      setCategories([
        {
          id: "1",
          name: "技术",
          slug: "tech",
          description: "技术相关文章",
          color: "#3B82F6",
          icon: "💻",
          sortOrder: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stats: {
            totalPosts: 5,
            publishedPosts: 3,
          },
        },
        {
          id: "2",
          name: "生活",
          slug: "life",
          description: "日常生活记录",
          color: "#10B981",
          icon: "🌱",
          sortOrder: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stats: {
            totalPosts: 2,
            publishedPosts: 1,
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 删除分类
  const handleDelete = async (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    const hasArticles = category.stats && category.stats.totalPosts > 0;

    if (hasArticles) {
      alert(
        `无法删除分类"${category.name}"，该分类下还有 ${category.stats?.totalPosts} 篇文章。请先移除这些文章或将其重新分类。`
      );
      return;
    }

    if (!confirm(`确定要删除分类"${category.name}"吗？此操作无法撤销。`))
      return;

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCategories(); // 重新获取数据
      } else {
        const error = await response.json();
        alert(error.message || "删除失败");
      }
    } catch (error) {
      console.error("删除分类失败:", error);
      alert("删除失败，请重试");
    }
  };

  // 调整排序
  const handleSortOrderChange = async (
    categoryId: string,
    direction: "up" | "down"
  ) => {
    const currentCategory = categories.find((c) => c.id === categoryId);
    if (!currentCategory) return;

    const sortedCategories = [...categories].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
    const currentIndex = sortedCategories.findIndex((c) => c.id === categoryId);

    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === sortedCategories.length - 1)
      return;

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const targetCategory = sortedCategories[targetIndex];

    try {
      // 交换排序顺序
      await Promise.all([
        fetch(`/api/admin/categories/${currentCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sortOrder: targetCategory.sortOrder }),
        }),
        fetch(`/api/admin/categories/${targetCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sortOrder: currentCategory.sortOrder }),
        }),
      ]);

      await fetchCategories(); // 重新获取数据
    } catch (error) {
      console.error("调整排序失败:", error);
    }
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "yyyy年MM月dd日", { locale: zhCN });
  };

  if (error && categories.length === 0) {
    return (
      <div className="rounded-md border p-6 text-center">
        <div className="text-red-600 mb-4">加载失败: {error}</div>
        <Button onClick={fetchCategories} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          重试
        </Button>
      </div>
    );
  }

  if (loading && categories.length === 0) {
    return (
      <div className="rounded-md border">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border-b">
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">排序</TableHead>
            <TableHead>名称</TableHead>
            <TableHead>描述</TableHead>
            <TableHead>文章数量</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead className="w-12">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((category, index) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => handleSortOrderChange(category.id, "up")}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={index === categories.length - 1}
                      onClick={() => handleSortOrderChange(category.id, "down")}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {category.color && (
                      <div
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                    {category.icon && (
                      <span className="text-lg">{category.icon}</span>
                    )}
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">
                        /{category.slug}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    {category.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {category.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="flex items-center space-x-1"
                    >
                      <FileText className="h-3 w-3" />
                      <span>{category.stats?.totalPosts || 0}</span>
                    </Badge>
                    {category.stats &&
                      category.stats.publishedPosts !==
                        category.stats.totalPosts && (
                        <Badge variant="secondary" className="text-xs">
                          {category.stats.publishedPosts} 已发布
                        </Badge>
                      )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(category.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">打开菜单</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>操作</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit?.(category)}>
                        <Edit className="h-4 w-4 mr-2" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {categories.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          暂无分类数据，点击&quot;新建分类&quot;开始创建
        </div>
      )}
    </div>
  );
}

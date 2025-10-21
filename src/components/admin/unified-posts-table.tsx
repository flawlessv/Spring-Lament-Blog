"use client";

/**
 * 统一风格的文章管理表格
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  Eye,
  Edit,
  Trash2,
  Star,
  Clock,
  User,
  Calendar,
  FileText,
  Plus,
  MoreHorizontal,
  Download,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModernTable } from "@/components/ui/modern-table";
import { useToast } from "@/hooks/use-toast";

// 文章数据类型
interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  published: boolean;
  featured: boolean;
  views: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  publishedAt?: string | Date;
  author: {
    username: string;
    profile?: {
      displayName?: string;
    };
  };
  category?: {
    id: string;
    name: string;
    color?: string;
  };
  tags: Array<{
    id: string;
    name: string;
    color?: string;
  }>;
}

// API 响应类型
interface PostsResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface UnifiedPostsTableProps {
  searchQuery?: string;
  statusFilter?: string;
  categoryFilter?: string;
  onSelectionChange?: (selectedIds: string[]) => void;
  enableTableFilters?: boolean; // 新增：启用表头筛选
}

export default function UnifiedPostsTable({
  searchQuery,
  statusFilter,
  categoryFilter,
  onSelectionChange,
  enableTableFilters = false,
}: UnifiedPostsTableProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);
  const [tableFilters, setTableFilters] = useState<Record<string, any>>({});
  const [availableTags, setAvailableTags] = useState<
    { label: string; value: string; color?: string }[]
  >([]);
  const [availableCategories, setAvailableCategories] = useState<
    { label: string; value: string; color?: string }[]
  >([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const { toast } = useToast();

  // 获取可用标签
  const fetchAvailableTags = async () => {
    try {
      const response = await fetch("/api/admin/tags");
      if (response.ok) {
        const data = await response.json();
        const tags = (data.tags || []).map((tag: any) => ({
          label: tag.name,
          value: tag.name,
          color: tag.color,
        }));
        setAvailableTags(tags);
      }
    } catch (error) {
      console.error("获取标签失败:", error);
    }
  };

  // 获取可用分类
  const fetchAvailableCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        const categories = (data.categories || []).map((category: any) => ({
          label: category.name,
          value: category.name,
          color: category.color,
        }));
        setAvailableCategories(categories);
      }
    } catch (error) {
      console.error("获取分类失败:", error);
    }
  };

  // 处理表头筛选
  const handleTableFilters = (filters: Record<string, any>) => {
    console.log("处理表头筛选:", filters);
    setTableFilters(filters);
    setPagination((prev) => ({ ...prev, page: 1 })); // 重置到第一页
  };

  // 获取文章数据
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchQuery) params.set("search", searchQuery);
      if (statusFilter && statusFilter !== "all")
        params.set("status", statusFilter);
      if (categoryFilter && categoryFilter !== "all")
        params.set("categoryId", categoryFilter);

      // 处理表头筛选
      if (tableFilters.title && tableFilters.title.trim()) {
        params.set("search", tableFilters.title.trim());
      }
      if (
        tableFilters.status &&
        Array.isArray(tableFilters.status) &&
        tableFilters.status.length > 0
      ) {
        params.set("status", tableFilters.status.join(","));
      }
      if (
        tableFilters.category &&
        Array.isArray(tableFilters.category) &&
        tableFilters.category.length > 0
      ) {
        params.set("categoryNames", tableFilters.category.join(","));
      }
      if (
        tableFilters.tags &&
        Array.isArray(tableFilters.tags) &&
        tableFilters.tags.length > 0
      ) {
        params.set("tagIds", tableFilters.tags.join(","));
      }

      console.log("发送筛选参数:", Object.fromEntries(params));

      const response = await fetch(`/api/admin/posts?${params}`);

      if (!response.ok) {
        throw new Error("获取文章数据失败");
      }

      const data: PostsResponse = await response.json();
      setPosts(data.posts);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [
    searchQuery,
    statusFilter,
    categoryFilter,
    pagination.page,
    tableFilters,
  ]);

  useEffect(() => {
    if (enableTableFilters) {
      fetchAvailableTags();
      fetchAvailableCategories();
    }
  }, [enableTableFilters]);

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "MM月dd日 HH:mm", { locale: zhCN });
  };

  const getStatusBadge = (post: Post) => {
    if (post.featured) {
      return (
        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
          <Star className="h-3 w-3 mr-1" />
          精选
        </Badge>
      );
    }
    if (post.published) {
      return (
        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
          已发布
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-gray-600">
        <Clock className="h-3 w-3 mr-1" />
        草稿
      </Badge>
    );
  };

  // 切换发布状态
  const handleTogglePublish = async (post: Post) => {
    try {
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !post.published }),
      });

      if (response.ok) {
        toast({
          title: post.published ? "取消发布成功" : "发布成功",
          variant: "success",
        });
        await fetchPosts();
      } else {
        throw new Error("操作失败");
      }
    } catch (error) {
      toast({
        title: "操作失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    }
  };

  // 切换精选状态
  const handleToggleFeature = async (post: Post) => {
    try {
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !post.featured }),
      });

      if (response.ok) {
        toast({
          title: post.featured ? "取消精选成功" : "设为精选成功",
          variant: "success",
        });
        await fetchPosts();
      } else {
        throw new Error("操作失败");
      }
    } catch (error) {
      toast({
        title: "操作失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    }
  };

  // 删除文章
  const handleDelete = async (post: Post) => {
    try {
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "删除成功",
          description: "文章已成功删除",
          variant: "success",
        });
        await fetchPosts();
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

  // 批量删除
  const handleBatchDelete = async (selectedIds: string[]) => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/admin/posts/${id}`, { method: "DELETE" })
        )
      );

      toast({
        title: "批量删除成功",
        description: `已删除 ${selectedIds.length} 篇文章`,
        variant: "success",
      });

      setSelectedIds([]);
      onSelectionChange?.([]);
      await fetchPosts();
    } catch (error) {
      toast({
        title: "批量删除失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    }
  };

  // 导出选中文章
  const handleExportSelected = async (selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      toast({
        title: "提示",
        description: "请先选择要导出的文章",
        variant: "default",
      });
      return;
    }

    setExporting(true);
    try {
      const response = await fetch("/api/admin/posts/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postIds: selectedIds,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `blog-export-selected-${new Date().toISOString().slice(0, 10)}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "导出成功",
          description: `已导出 ${selectedIds.length} 篇文章`,
          variant: "default",
        });
      } else {
        const result = await response.json();
        throw new Error(result.error || "导出失败");
      }
    } catch (error) {
      toast({
        title: "导出失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  // 状态筛选选项
  const statusOptions = [
    { label: "已发布", value: "published", color: "#10B981" },
    { label: "草稿", value: "draft", color: "#6B7280" },
    { label: "精选", value: "featured", color: "#F59E0B" },
  ];

  const columns = [
    {
      key: "title",
      title: "文章信息",
      width: "flex-1",
      filter: enableTableFilters
        ? {
            type: "text" as const,
            placeholder: "搜索文章标题...",
            onFilter: (value: string) => {
              console.log("Title filter:", value);
            },
          }
        : undefined,
      render: (_: unknown, post: Post) => (
        <div className="min-w-0">
          <Link
            href={`/admin/posts/${post.id}/edit`}
            className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors block truncate"
          >
            {post.title}
          </Link>

          <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            {post.category && (
              <div className="flex items-center space-x-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: post.category.color || "#6B7280" }}
                />
                <span>{post.category.name}</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      title: "分类",
      width: "w-32",
      filter: enableTableFilters
        ? {
            type: "multiselect" as const,
            options: availableCategories,
            placeholder: "筛选分类",
            onFilter: (value: string) => {
              console.log("Category filter:", value);
            },
          }
        : undefined,
      render: (_: unknown, post: Post) => (
        <div className="flex items-center space-x-2">
          {post.category ? (
            <>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: post.category.color || "#6B7280" }}
              />
              <span className="text-sm text-gray-700 truncate">
                {post.category.name}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      key: "tags",
      title: "标签",
      width: "w-56",
      filter: enableTableFilters
        ? {
            type: "multiselect" as const,
            options: availableTags,
            placeholder: "筛选标签",
            onFilter: (value: string) => {
              console.log("Tags filter:", value);
            },
          }
        : undefined,
      render: (_: unknown, post: Post) => (
        <div className="flex flex-wrap gap-1">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag.id}
              style={{ backgroundColor: tag.color || "#6B7280" }}
              className="text-white text-xs px-2 py-0.5 rounded-lg"
            >
              {tag.name}
            </Badge>
          ))}
          {post.tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{post.tags.length - 3}
            </span>
          )}
          {post.tags.length === 0 && (
            <span className="text-sm text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      title: "状态",
      width: "w-24",
      className: "text-center",
      filter: enableTableFilters
        ? {
            type: "multiselect" as const,
            options: statusOptions,
            placeholder: "筛选状态",
            onFilter: (value: string) => {
              console.log("Status filter:", value);
            },
          }
        : undefined,
      render: (_: unknown, post: Post) => getStatusBadge(post),
    },
    {
      key: "views",
      title: "浏览量",
      width: "w-20",
      className: "text-center",
      render: (_: unknown, post: Post) => (
        <div className="flex items-center justify-center space-x-1 text-gray-600">
          <Eye className="h-4 w-4" />
          <span className="font-medium">{post.views.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: "updatedAt",
      title: "更新时间",
      width: "w-24",
      className: "text-center",
      render: (_: unknown, post: Post) => (
        <span className="text-sm text-gray-500">
          {formatDate(post.updatedAt)}
        </span>
      ),
    },
    {
      key: "actions",
      title: "操作",
      width: "w-52",
      className: "text-center",
      render: (_: unknown, post: Post) => (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            onClick={() => window.open(`/posts/${post.slug}`, "_blank")}
          >
            <Eye className="h-4 w-4 mr-1" />
            预览
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            onClick={() =>
              (window.location.href = `/admin/posts/${post.id}/edit`)
            }
          >
            <Edit className="h-4 w-4 mr-1" />
            编辑
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-xl border-gray-200"
            >
              <DropdownMenuLabel className="text-gray-700">
                更多操作
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleTogglePublish(post)}
                className={`rounded-lg ${
                  post.published ? "text-orange-600" : "text-green-600"
                }`}
              >
                {post.published ? "取消发布" : "发布"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleToggleFeature(post)}
                className="rounded-lg"
              >
                <Star className="h-4 w-4 mr-2" />
                {post.featured ? "取消精选" : "设为精选"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(post)}
                className="rounded-lg text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const actions = [
    {
      key: "preview",
      label: "预览",
      icon: <Eye className="h-4 w-4" />,
      onClick: (post: Post) => {
        window.open(`/${post.slug}`, "_blank");
      },
    },
    {
      key: "edit",
      label: "编辑",
      icon: <Edit className="h-4 w-4" />,
      onClick: (post: Post) => {
        window.location.href = `/admin/posts/${post.id}/edit`;
      },
    },
    {
      key: "publish",
      label: (post: Post) => (post.published ? "取消发布" : "发布"),
      onClick: handleTogglePublish,
      variant: (post: Post) =>
        post.published ? "warning" : ("success" as const),
    },
    {
      key: "feature",
      label: (post: Post) => (post.featured ? "取消精选" : "设为精选"),
      icon: <Star className="h-4 w-4" />,
      onClick: handleToggleFeature,
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
      label: exporting ? "导出中..." : "导出选中",
      onClick: handleExportSelected,
      variant: "default" as const,
      icon: exporting ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      ),
      disabled: exporting,
    },
    {
      label: "批量删除",
      onClick: handleBatchDelete,
      variant: "danger" as const,
      icon: <Trash2 className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <ModernTable
      data={posts}
      columns={columns}
      loading={loading}
      error={error}
      searchable={true}
      searchPlaceholder="搜索文章标题..."
      onSearch={fetchPosts}
      filterable={enableTableFilters}
      onFilterChange={(filters) => {
        console.log("Table filters changed:", filters);
        // 处理筛选逻辑
        handleTableFilters(filters);
      }}
      selectable={true}
      selectedIds={selectedIds}
      onSelectionChange={(ids) => {
        setSelectedIds(ids);
        onSelectionChange?.(ids);
      }}
      createButton={{
        label: "新建文章",
        href: "/admin/posts/new",
        icon: <Plus className="mr-2 h-4 w-4" />,
      }}
      batchActions={batchActions}
      pagination={{
        current: pagination.page,
        total: pagination.total,
        pageSize: pagination.limit,
        onChange: (page) => setPagination((prev) => ({ ...prev, page })),
      }}
      emptyIcon={<FileText className="h-10 w-10 text-gray-400" />}
      emptyTitle="暂无文章"
      emptyDescription="开始创建您的第一篇文章吧"
      getRecordId={(post) => post.id}
      onRetry={fetchPosts}
    />
  );
}

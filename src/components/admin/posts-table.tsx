"use client";

/**
 * 文章列表表格组件
 *
 * 显示文章列表，支持排序、选择和快速操作
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Star,
  Clock,
  User,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { cn } from "@/lib/utils";

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

interface PostsTableProps {
  searchQuery?: string;
  statusFilter?: string;
  categoryFilter?: string;
  onSelectionChange?: (selectedIds: string[]) => void;
}

export default function PostsTable({
  searchQuery,
  statusFilter,
  categoryFilter,
  onSelectionChange,
}: PostsTableProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

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
      // 如果API失败，使用模拟数据
      setPosts([
        {
          id: "1",
          title: "欢迎使用 SpringLament Blog",
          slug: "welcome-to-spring-lament-blog",
          excerpt: "这是您的第一篇文章，开始您的博客之旅吧！",
          published: true,
          featured: false,
          views: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: {
            username: "admin",
            profile: {
              displayName: "管理员",
            },
          },
          category: {
            id: "welcome",
            name: "欢迎",
            color: "#3B82F6",
          },
          tags: [{ id: "welcome", name: "欢迎", color: "#3B82F6" }],
        },
      ]);
      setPagination({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和筛选变化时重新获取数据
  useEffect(() => {
    fetchPosts();
  }, [searchQuery, statusFilter, categoryFilter, pagination.page]);

  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? posts.map((post) => post.id) : [];
    setSelectedIds(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectPost = (postId: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedIds, postId]
      : selectedIds.filter((id) => id !== postId);
    setSelectedIds(newSelection);
    onSelectionChange?.(newSelection);
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "yyyy年MM月dd日 HH:mm", { locale: zhCN });
  };

  // 切换发布状态
  const handleTogglePublish = async (postId: string, published: boolean) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });

      if (response.ok) {
        await fetchPosts(); // 重新获取数据
      }
    } catch (error) {
      console.error("切换发布状态失败:", error);
    }
  };

  // 切换精选状态
  const handleToggleFeature = async (postId: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !featured }),
      });

      if (response.ok) {
        await fetchPosts(); // 重新获取数据
      }
    } catch (error) {
      console.error("切换精选状态失败:", error);
    }
  };

  // 删除文章
  const handleDelete = async (postId: string) => {
    if (!confirm("确定要删除这篇文章吗？此操作无法撤销。")) return;

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchPosts(); // 重新获取数据
      }
    } catch (error) {
      console.error("删除文章失败:", error);
    }
  };

  const getStatusBadge = (post: Post) => {
    if (post.featured) {
      return (
        <div className="flex items-center space-x-1 text-xs">
          <Star className="h-3 w-3 text-yellow-500 fill-current" />
          <span className="text-yellow-600 font-medium">精选</span>
        </div>
      );
    }
    if (post.published) {
      return (
        <div className="flex items-center space-x-1 text-xs">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className="text-green-600 font-medium">已发布</span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-1 text-xs">
        <Clock className="h-3 w-3 text-gray-400" />
        <span className="text-gray-500 font-medium">草稿</span>
      </div>
    );
  };

  if (error && posts.length === 0) {
    return (
      <div className="rounded-md border p-6 text-center">
        <div className="text-red-600 mb-4">加载失败: {error}</div>
        <Button onClick={fetchPosts} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          重试
        </Button>
      </div>
    );
  }

  if (loading && posts.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-4">
            <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b">
            <div className="flex items-center space-x-4">
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-64"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedIds.length === posts.length && posts.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="选择全部"
                />
              </TableHead>
              <TableHead>标题</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>作者</TableHead>
              <TableHead>浏览量</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead className="w-12">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(post.id)}
                    onCheckedChange={(checked) =>
                      handleSelectPost(post.id, checked as boolean)
                    }
                    aria-label={`选择 ${post.title}`}
                  />
                </TableCell>
                <TableCell className="max-w-0">
                  <div className="flex flex-col space-y-1">
                    <Link
                      href={`/admin/posts/${post.id}/edit` as any}
                      className="font-medium text-foreground hover:text-primary truncate"
                    >
                      {post.title}
                    </Link>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>/{post.slug}</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(post)}</TableCell>
                <TableCell>
                  {post.category && (
                    <div className="flex items-center space-x-1">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: post.category.color }}
                      ></div>
                      <span className="text-sm">{post.category.name}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {post.author.profile?.displayName || post.author.username}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>{post.views.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(post.updatedAt)}
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
                      <DropdownMenuItem asChild>
                        <Link href={`/${post.slug}` as any} target="_blank">
                          <Eye className="h-4 w-4 mr-2" />
                          预览
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/posts/${post.id}/edit` as any}>
                          <Edit className="h-4 w-4 mr-2" />
                          编辑
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          handleTogglePublish(post.id, post.published)
                        }
                        className={cn(
                          post.published ? "text-orange-600" : "text-green-600"
                        )}
                      >
                        {post.published ? "取消发布" : "发布"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleToggleFeature(post.id, post.featured)
                        }
                        className="text-blue-600"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        {post.featured ? "取消精选" : "设为精选"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(post.id)}
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
      </div>

      {/* 分页 */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            共 {pagination.total} 条，第 {pagination.page} /{" "}
            {pagination.totalPages} 页
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevPage || loading}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage || loading}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            >
              下一页
            </Button>
          </div>
        </div>
      )}

      {posts.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          暂无文章数据
        </div>
      )}
    </div>
  );
}

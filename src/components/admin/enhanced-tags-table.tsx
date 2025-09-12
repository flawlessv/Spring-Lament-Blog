"use client";

/**
 * 增强的标签列表表格组件
 *
 * 显示标签列表，支持搜索、编辑、删除和批量操作
 * 使用新的UI组件和改进的用户体验
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
  Search,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading";
import { DeleteConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

// 标签数据类型
interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: {
    posts: number;
  };
}

// API 响应类型
interface TagsResponse {
  tags: Tag[];
}

interface TagsTableProps {
  onEdit?: (tag: Tag) => void;
}

export default function EnhancedTagsTable({ onEdit }: TagsTableProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTag, setDeleteTag] = useState<Tag | null>(null);
  const { toast } = useToast();

  // 获取标签数据
  const fetchTags = async (search?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search?.trim()) {
        params.set("search", search.trim());
      }

      const response = await fetch(`/api/admin/tags?${params}`);

      if (!response.ok) {
        throw new Error("获取标签数据失败");
      }

      const data: TagsResponse = await response.json();
      setTags(data.tags || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "未知错误";
      setError(errorMessage);
      toast({
        title: "加载失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchTags();
  }, []);

  // 搜索处理
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const debounceTimer = setTimeout(() => {
      fetchTags(query);
    }, 500);

    return () => clearTimeout(debounceTimer);
  };

  // 删除标签确认
  const handleDeleteClick = (tag: Tag) => {
    setDeleteTag(tag);
  };

  // 执行删除
  const confirmDelete = async () => {
    if (!deleteTag) return;

    try {
      const response = await fetch(`/api/admin/tags/${deleteTag.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "删除失败");
      }

      // 更新本地状态
      setTags((prev) => prev.filter((tag) => tag.id !== deleteTag.id));
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTag.id));

      toast({
        title: "删除成功",
        description: `标签"${deleteTag.name}"已成功删除`,
        variant: "success",
      });

      setDeleteTag(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "删除失败";
      toast({
        title: "删除失败",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // 批量选择处理
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(tags.map((tag) => tag.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (tagId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, tagId]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== tagId));
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/admin/tags/${id}`, { method: "DELETE" })
        )
      );

      setTags((prev) => prev.filter((tag) => !selectedIds.includes(tag.id)));
      setSelectedIds([]);

      toast({
        title: "批量删除成功",
        description: `已删除 ${selectedIds.length} 个标签`,
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "批量删除失败",
        description: "请重试",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "yyyy年MM月dd日", { locale: zhCN });
  };

  // 加载状态
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
            <Input placeholder="搜索标签名称..." className="pl-9" disabled />
          </div>
          <Link href="/admin/tags/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新建标签
            </Button>
          </Link>
        </div>
        <LoadingSpinner className="py-8" />
      </div>
    );
  }

  // 错误状态
  if (error && tags.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
            <Input
              placeholder="搜索标签名称..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 border-0 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          <Link href="/admin/tags/new">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              新建标签
            </Button>
          </Link>
        </div>
        <div className="rounded-xl border-0 bg-gradient-to-br from-red-50 to-pink-50 p-8 text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
            <RefreshCw className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">加载失败</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => fetchTags()}
            variant="outline"
            className="shadow-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            重试
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 搜索和操作栏 */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
          <Input
            placeholder="搜索标签名称..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center space-x-2">
          {selectedIds.length > 0 && (
            <>
              <span className="text-sm text-muted-foreground">
                已选择 {selectedIds.length} 项
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBatchDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                批量删除
              </Button>
            </>
          )}
          <Link href="/admin/tags/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新建标签
            </Button>
          </Link>
        </div>
      </div>

      {/* 标签表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedIds.length === tags.length && tags.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>标签名称</TableHead>
              <TableHead>URL别名</TableHead>
              <TableHead>文章数量</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="w-12">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  {searchQuery ? "未找到匹配的标签" : "暂无标签数据"}
                </TableCell>
              </TableRow>
            ) : (
              tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(tag.id)}
                      onCheckedChange={(checked) =>
                        handleSelectOne(tag.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge
                        style={{ backgroundColor: tag.color || "#6B7280" }}
                        className="text-white"
                      >
                        {tag.name}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {tag.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{tag._count?.posts || 0} 篇</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(tag.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>操作</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit?.(tag)}>
                          <Edit className="mr-2 h-4 w-4" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(tag)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 删除确认对话框 */}
      <DeleteConfirmDialog
        open={!!deleteTag}
        onClose={() => setDeleteTag(null)}
        onConfirm={confirmDelete}
        itemName={deleteTag?.name || ""}
        itemType="标签"
      />
    </div>
  );
}

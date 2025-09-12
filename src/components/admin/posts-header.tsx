"use client";

/**
 * 文章管理页面头部组件
 *
 * 包含搜索、筛选和批量操作功能
 */

import { useState } from "react";
import { Search, Filter, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostsHeaderProps {
  onSearch?: (query: string) => void;
  onStatusFilter?: (status: string) => void;
  onCategoryFilter?: (categoryId: string) => void;
  onBatchAction?: (action: string, selectedIds: string[]) => void;
  selectedCount?: number;
}

export default function PostsHeader({
  onSearch,
  onStatusFilter,
  onCategoryFilter,
  onBatchAction,
  selectedCount = 0,
}: PostsHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* 搜索框 */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
        <Input
          placeholder="搜索文章标题、内容..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* 筛选器 */}
      <div className="flex items-center space-x-2">
        {/* 发布状态筛选 */}
        <Select onValueChange={onStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="published">已发布</SelectItem>
            <SelectItem value="draft">草稿</SelectItem>
            <SelectItem value="featured">精选</SelectItem>
          </SelectContent>
        </Select>

        {/* 分类筛选 */}
        <Select onValueChange={onCategoryFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部分类</SelectItem>
            <SelectItem value="tech">技术</SelectItem>
            <SelectItem value="life">生活</SelectItem>
            <SelectItem value="thoughts">随想</SelectItem>
          </SelectContent>
        </Select>

        {/* 更多筛选选项 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>排序方式</DropdownMenuLabel>
            <DropdownMenuItem>最新创建</DropdownMenuItem>
            <DropdownMenuItem>最新更新</DropdownMenuItem>
            <DropdownMenuItem>浏览量</DropdownMenuItem>
            <DropdownMenuItem>标题 A-Z</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>时间范围</DropdownMenuLabel>
            <DropdownMenuItem>今天</DropdownMenuItem>
            <DropdownMenuItem>本周</DropdownMenuItem>
            <DropdownMenuItem>本月</DropdownMenuItem>
            <DropdownMenuItem>本年</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 批量操作 */}
      {selectedCount > 0 && (
        <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-md">
          <span className="text-sm text-muted-foreground">
            已选择 {selectedCount} 项
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm">
                批量操作
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onBatchAction?.("publish", [])}
                className="text-green-600"
              >
                批量发布
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onBatchAction?.("unpublish", [])}
              >
                取消发布
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onBatchAction?.("feature", [])}
                className="text-blue-600"
              >
                设为精选
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onBatchAction?.("export", [])}>
                <Download className="h-4 w-4 mr-2" />
                导出选中
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onBatchAction?.("delete", [])}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                批量删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

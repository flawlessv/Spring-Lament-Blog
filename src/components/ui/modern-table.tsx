"use client";

/**
 * 统一的现代化表格组件
 *
 * 提供卡片式设计，支持搜索、选择、操作等功能
 */

import { ReactNode, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Trash2,
  MoreHorizontal,
  RefreshCw,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableFilter } from "@/components/ui/table-filter";
import { Card, CardContent } from "@/components/ui/card";
import { FullScreenLoading } from "@/components/ui/loading";
import { DeleteConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// 筛选器类型
interface FilterOption {
  label: string;
  value: string;
  color?: string;
}

interface ColumnFilter {
  type: "select" | "multiselect" | "text" | "date";
  options?: FilterOption[];
  placeholder?: string;
  onFilter?: (value: any) => void;
}

interface ModernTableColumn {
  key: string;
  title: string;
  width?: string;
  className?: string;
  render?: (value: any, record: any) => ReactNode;
  filter?: ColumnFilter;
}

interface ModernTableAction {
  key: string;
  label: string | ((record: any) => string);
  icon?: ReactNode;
  onClick: (record: any) => void;
  className?: string;
  variant?:
    | "default"
    | "danger"
    | "warning"
    | "success"
    | ((record: any) => "default" | "danger" | "warning" | "success");
}

interface ModernTableProps<T = any> {
  // 数据
  data: T[];
  columns: ModernTableColumn[];

  // 状态
  loading?: boolean;
  error?: string | null;

  // 搜索
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;

  // 筛选
  filterable?: boolean;
  onFilterChange?: (filters: Record<string, any>) => void;

  // 选择
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;

  // 操作
  actions?: ModernTableAction[];

  // 新建按钮
  createButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: ReactNode;
  };

  // 批量操作
  batchActions?: Array<{
    label: string;
    onClick: (selectedIds: string[]) => void;
    variant?: "default" | "danger";
    icon?: ReactNode;
    disabled?: boolean;
  }>;

  // 分页
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
  };

  // 样式
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;

  // 获取记录ID的函数
  getRecordId: (record: T) => string;

  // 重试函数
  onRetry?: () => void;
}

export function ModernTable<T = any>({
  data,
  columns,
  loading = false,
  error = null,
  searchable = true,
  searchPlaceholder = "搜索...",
  onSearch,
  filterable = false,
  onFilterChange,
  selectable = true,
  selectedIds = [],
  onSelectionChange,
  actions = [],
  createButton,
  batchActions = [],
  pagination,
  emptyIcon,
  emptyTitle = "暂无数据",
  emptyDescription = "没有找到相关数据",
  getRecordId,
  onRetry,
}: ModernTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteRecord, setDeleteRecord] = useState<T | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleFilterChange = (columnKey: string, value: any) => {
    const newFilters = { ...filters, [columnKey]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilter = (columnKey: string) => {
    const newFilters = { ...filters };
    delete newFilters[columnKey];
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    onFilterChange?.({});
  };

  const openPopover = (columnKey: string) => {
    setOpenPopovers((prev) => ({ ...prev, [columnKey]: true }));
  };

  const closePopover = (columnKey: string) => {
    setOpenPopovers((prev) => ({ ...prev, [columnKey]: false }));
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? data.map(getRecordId) : [];
    onSelectionChange?.(newSelection);
  };

  const handleSelectRecord = (recordId: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedIds, recordId]
      : selectedIds.filter((id) => id !== recordId);
    onSelectionChange?.(newSelection);
  };

  const handleAction = (action: ModernTableAction, record: T) => {
    if (action.variant === "danger") {
      setDeleteRecord(record);
    } else {
      action.onClick(record);
    }
  };

  const confirmDelete = () => {
    if (deleteRecord) {
      const deleteAction = actions.find((a) => a.variant === "danger");
      if (deleteAction) {
        deleteAction.onClick(deleteRecord);
      }
      setDeleteRecord(null);
    }
  };

  // 加载状态
  if (loading && data.length === 0) {
    return <FullScreenLoading text="永言配命，莫向外求。" />;
  }

  // 错误状态
  if (error && data.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-950 rounded-2xl mb-4">
            <RefreshCw className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            加载失败
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="shadow-sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              重试
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 搜索和操作栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {searchable && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 -translate-y-1/2" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors rounded-xl"
            />
          </div>
        )}

        <div className="flex items-center space-x-3">
          {/* 批量操作区域 - 始终保持空间以避免抖动 */}
          {selectable && batchActions.length > 0 && (
            <div
              className={cn(
                "transition-all duration-200 ease-in-out",
                selectedIds.length > 0
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-4 pointer-events-none"
              )}
            >
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-950 rounded-xl min-w-0">
                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium whitespace-nowrap">
                  已选择 {selectedIds.length} 项
                </span>
                {batchActions.map((batchAction, index) => {
                  const isDisabled =
                    selectedIds.length === 0 || batchAction.disabled;
                  return (
                    <Button
                      key={index}
                      variant={
                        batchAction.variant === "danger"
                          ? "destructive"
                          : "default"
                      }
                      size="sm"
                      onClick={() => batchAction.onClick(selectedIds)}
                      disabled={isDisabled}
                      className={cn(
                        "rounded-lg transition-all duration-200",
                        batchAction.variant === "danger" &&
                          "bg-red-500 hover:bg-red-600",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {batchAction.icon}
                      {batchAction.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 新建按钮 */}
          {createButton &&
            (createButton.href ? (
              <Link href={createButton.href as any}>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg">
                  {createButton.icon || <Plus className="mr-2 h-4 w-4" />}
                  {createButton.label}
                </Button>
              </Link>
            ) : (
              <Button
                onClick={createButton.onClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg"
              >
                {createButton.icon || <Plus className="mr-2 h-4 w-4" />}
                {createButton.label}
              </Button>
            ))}
        </div>
      </div>

      {/* 表格内容 */}
      {data.length === 0 &&
      !loading &&
      !filterable &&
      Object.keys(filters).length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-6">
              {emptyIcon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {emptyTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery ? "未找到匹配的结果" : emptyDescription}
            </p>
            {!searchQuery &&
              createButton &&
              (createButton.href ? (
                <Link href={createButton.href as any}>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg">
                    {createButton.icon || <Plus className="mr-2 h-4 w-4" />}
                    {createButton.label}
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={createButton.onClick}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg"
                >
                  {createButton.icon || <Plus className="mr-2 h-4 w-4" />}
                  {createButton.label}
                </Button>
              ))}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* 表头 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectable && (
                <div className="w-8">
                  <Checkbox
                    checked={
                      selectedIds.length === data.length && data.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                    className="rounded-md"
                  />
                </div>
              )}
              {columns.map((column) => (
                <div
                  key={column.key}
                  className={cn(
                    column.width || "flex-1",
                    column.className,
                    "flex items-center space-x-2"
                  )}
                >
                  <span>{column.title}</span>
                  {filterable && column.filter && (
                    <TableFilter
                      columnKey={column.key}
                      columnTitle={column.title}
                      filterType={column.filter.type}
                      options={column.filter.options}
                      placeholder={column.filter.placeholder}
                      currentValue={filters[column.key]}
                      onFilterChange={handleFilterChange}
                      onApply={closePopover}
                      onReset={clearFilter}
                      onOpen={openPopover}
                      onClose={closePopover}
                      isOpen={openPopovers[column.key] || false}
                    />
                  )}
                </div>
              ))}
              {actions.length > 0 && (
                <div className="w-12 text-center">操作</div>
              )}
            </div>
          </div>

          {/* 数据行 */}
          {data.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-gray-500 dark:text-gray-400">
                  <Filter className="h-8 w-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                  <p className="text-sm">没有找到匹配筛选条件的数据</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    请尝试调整筛选条件
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            data.map((record) => {
              const recordId = getRecordId(record);
              return (
                <Card
                  key={recordId}
                  className="overflow-hidden hover:shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {selectable && (
                        <div>
                          <Checkbox
                            checked={selectedIds.includes(recordId)}
                            onCheckedChange={(checked) =>
                              handleSelectRecord(recordId, checked as boolean)
                            }
                            className="rounded-md"
                          />
                        </div>
                      )}

                      {columns.map((column) => (
                        <div
                          key={column.key}
                          className={cn(
                            column.width || "flex-1",
                            "min-w-0",
                            column.className
                          )}
                        >
                          {column.render
                            ? column.render(
                                record[column.key as keyof T],
                                record
                              )
                            : String(record[column.key as keyof T] || "")}
                        </div>
                      ))}

                      {actions.length > 0 && (
                        <div className="w-12">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                            >
                              <DropdownMenuLabel className="text-gray-700 dark:text-gray-300">
                                操作
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {actions.map((action, index) => (
                                <DropdownMenuItem
                                  key={action.key}
                                  onClick={() => handleAction(action, record)}
                                  className={cn(
                                    "rounded-lg",
                                    (typeof action.variant === "function"
                                      ? action.variant(record)
                                      : action.variant) === "danger" &&
                                      "text-red-600 dark:text-red-400",
                                    (typeof action.variant === "function"
                                      ? action.variant(record)
                                      : action.variant) === "warning" &&
                                      "text-orange-600 dark:text-orange-400",
                                    (typeof action.variant === "function"
                                      ? action.variant(record)
                                      : action.variant) === "success" &&
                                      "text-green-600 dark:text-green-400",
                                    action.className
                                  )}
                                >
                                  {action.icon && (
                                    <span className="mr-2">{action.icon}</span>
                                  )}
                                  {typeof action.label === "function"
                                    ? action.label(record)
                                    : action.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* 分页 */}
      {pagination && pagination.total > pagination.pageSize && (
        <div className="flex items-center justify-between px-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            共 {pagination.total} 条，第 {pagination.current} /{" "}
            {Math.ceil(pagination.total / pagination.pageSize)} 页
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current <= 1 || loading}
              onClick={() => pagination.onChange(pagination.current - 1)}
              className="rounded-lg"
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={
                pagination.current >=
                  Math.ceil(pagination.total / pagination.pageSize) || loading
              }
              onClick={() => pagination.onChange(pagination.current + 1)}
              className="rounded-lg"
            >
              下一页
            </Button>
          </div>
        </div>
      )}

      {/* 删除确认对话框 */}
      <DeleteConfirmDialog
        open={!!deleteRecord}
        onClose={() => setDeleteRecord(null)}
        onConfirm={confirmDelete}
        itemName="记录"
        itemType="数据"
      />
    </div>
  );
}

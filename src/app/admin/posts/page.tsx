"use client";

/**
 * 文章管理页面
 *
 * 提供文章的创建、编辑、删除和批量操作功能
 * 包括筛选、搜索和分页功能
 */

import { useState, useRef } from "react";
import CleanAdminLayout from "@/components/admin/clean-admin-layout";
import UnifiedPostsTable from "@/components/admin/unified-posts-table";
import { Button } from "@/components/ui/button";
import { Plus, Download, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exportingAll, setExportingAll] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleBatchAction = (action: string, ids: string[]) => {
    console.log("批量操作:", action, ids);
    // TODO: 实现批量操作功能
  };

  // 导出所有文章
  const handleExportAll = async () => {
    setExportingAll(true);
    try {
      const response = await fetch("/api/admin/posts/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exportAll: true,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `blog-export-all-${new Date().toISOString().slice(0, 10)}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "导出成功",
          description: "已导出所有文章",
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
      setExportingAll(false);
    }
  };

  // 导入 Markdown 文件
  const handleImportFiles = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setImporting(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/admin/posts/import", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "导入完成",
          description: result.message,
          variant: "default",
        });

        // 显示详细结果
        if (result.results.errors.length > 0) {
          const errorMsg = result.results.errors.slice(0, 3).join(", ");
          toast({
            title: "部分文件导入失败",
            description: `错误信息: ${errorMsg}${result.results.errors.length > 3 ? "..." : ""}`,
            variant: "destructive",
          });
        }
      } else {
        const result = await response.json();
        throw new Error(result.error || "导入失败");
      }
    } catch (error) {
      toast({
        title: "导入失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      // 重置文件输入框
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // 点击导入按钮
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // 文件选择改变
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleImportFiles(files);
    }
  };

  return (
    <CleanAdminLayout>
      <div className="space-y-4">
        {/* 页面标题和操作按钮 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
            <h1 className="text-xl font-semibold text-gray-900">文章管理</h1>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleImportClick}
              disabled={importing}
              className="flex items-center"
            >
              {importing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  导入中...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  导入文章
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleExportAll}
              disabled={exportingAll}
              className="flex items-center"
            >
              {exportingAll ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  导出中...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  导出所有文章
                </>
              )}
            </Button>

            <Link href="/admin/posts/new">
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                新建文章
              </Button>
            </Link>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <UnifiedPostsTable
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
            onSelectionChange={setSelectedIds}
          />
        </div>

        {/* 隐藏的文件输入框 */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".md,.markdown"
          multiple
          className="hidden"
        />
      </div>
    </CleanAdminLayout>
  );
}

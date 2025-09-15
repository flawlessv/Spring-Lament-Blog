"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Send, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import PublishDialog from "./publish-dialog";

// 动态导入MDEditor以避免SSR问题
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <div className="text-muted-foreground">正在加载编辑器...</div>
    </div>
  ),
});

interface FullscreenEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onClose: () => void;
  onSave: () => void;
  onPublish: (data: PublishData) => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export interface PublishData {
  categoryId?: string;
  tags: string[];
  coverImage?: string;
  excerpt?: string;
  published: boolean;
  featured: boolean;
}

export default function FullscreenEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  onClose,
  onSave,
  onPublish,
  isLoading = false,
  mode = "create",
}: FullscreenEditorProps) {
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // 计算字数和字符数
  useEffect(() => {
    const textContent = content.replace(/[#*`_\[\]()!-]/g, "").trim();
    setWordCount(
      textContent.split(/\s+/).filter((word) => word.length > 0).length
    );
    setCharCount(content.length);
  }, [content]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            onSave();
            break;
          case "Enter":
            e.preventDefault();
            setShowPublishDialog(true);
            break;
          case "Escape":
            e.preventDefault();
            onClose();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onSave, onClose]);

  const handlePublish = useCallback(
    (data: PublishData) => {
      onPublish(data);
      setShowPublishDialog(false);
    },
    [onPublish]
  );

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-semibold">
              {mode === "create" ? "新建文章" : "编辑文章"}
            </h1>
            {title && (
              <Badge variant="outline" className="text-xs">
                {title}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* 统计信息 */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>{wordCount} 词</span>
            <span>{charCount} 字符</span>
          </div>

          {/* 操作按钮 */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isLoading}
            className="h-8"
          >
            <Save className="h-4 w-4 mr-2" />
            保存草稿
          </Button>

          <Button
            size="sm"
            onClick={() => setShowPublishDialog(true)}
            disabled={isLoading || !title.trim() || !content.trim()}
            className="h-8"
          >
            <Send className="h-4 w-4 mr-2" />
            发布
          </Button>
        </div>
      </div>

      {/* 标题输入区域 */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="请输入文章标题..."
          className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground resize-none"
          autoFocus
        />
      </div>

      {/* Markdown编辑器区域 */}
      <div
        className="flex-1 overflow-hidden pb-6"
        style={{ height: "calc(100vh - 140px)" }}
      >
        <div className="h-full" data-color-mode="light">
          <MDEditor
            value={content}
            onChange={(val) => onContentChange(val || "")}
            preview="live"
            hideToolbar={false}
            visibleDragbar={false}
            height="100%"
            data-color-mode="light"
            className="h-full"
            textareaProps={{
              placeholder:
                "开始写作吧...\n\n支持 Markdown 语法：\n- **粗体**\n- *斜体*\n- `代码`\n- # 标题\n- - 列表\n- [链接](url)\n- ![图片](url)",
              style: {
                fontSize: 16,
                lineHeight: 1.6,
                fontFamily:
                  "'SF Mono', Monaco, 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace",
                minHeight: "calc(100vh - 220px)",
              },
            }}
          />
        </div>
      </div>

      {/* 发布对话框 */}
      <PublishDialog
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        onPublish={handlePublish}
        mode={mode}
      />
    </div>
  );
}

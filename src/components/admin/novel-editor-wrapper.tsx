/**
 * Novel 编辑器包装组件
 *
 * 功能：将 Novel（Notion 风格的 WYSIWYG 编辑器）与 Markdown 格式进行双向同步
 *
 * 简化设计：
 * - 编辑器内部使用 Tiptap JSONContent 格式
 * - 外部使用 Markdown 格式
 * - 使用简单的标志防止循环更新
 */

"use client";

import { useEffect, useRef, useMemo } from "react";
import {
  EditorRoot,
  EditorContent,
  StarterKit,
  Placeholder,
  TiptapLink,
} from "novel";
import { AICompletion } from "@/lib/editor/ai-completion-extension";
import {
  markdownToJSON,
  jsonToMarkdown,
} from "@/lib/editor/markdown-converter";

interface NovelEditorWrapperProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function NovelEditorWrapper({
  value,
  onChange,
  placeholder = "开始写作吧...",
}: NovelEditorWrapperProps) {
  // 防止循环更新的标志
  const isUpdatingRef = useRef(false);
  const editorRef = useRef<any>(null);

  // 初始化内容：将 Markdown 转换为 JSONContent
  const initialContent = useMemo(() => {
    if (!value.trim()) {
      return { type: "doc", content: [{ type: "paragraph" }] };
    }
    try {
      return markdownToJSON(value);
    } catch (error) {
      console.error("初始化内容出错:", error);
      return { type: "doc", content: [{ type: "paragraph" }] };
    }
  }, []);

  // 当外部 value 变化时，更新编辑器
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || isUpdatingRef.current) return;

    // 比较内容是否真的变化了
    const currentMarkdown = jsonToMarkdown(editor.getJSON());
    if (currentMarkdown.trim() === value.trim()) return;

    // 更新编辑器内容
    isUpdatingRef.current = true;
    editor.commands.setContent(markdownToJSON(value));
    // 立即重置标志，因为 setContent 是同步的
    isUpdatingRef.current = false;
  }, [value]);

  return (
    <div className="h-full w-full flex flex-col bg-background">
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          immediatelyRender={false}
          className="novel-editor min-h-full w-full px-6 py-4 focus:outline-none prose prose-sm max-w-none"
          extensions={[
            StarterKit.configure({}),
            TiptapLink.configure({
              openOnClick: false,
            }),
            Placeholder.configure({
              placeholder: placeholder,
            }),
            AICompletion.configure({
              debounceMs: 500,
              minChars: 3,
              apiEndpoint: "/api/ai/write/complete",
            }),
          ]}
          onUpdate={({ editor }) => {
            // 保存编辑器实例
            editorRef.current = editor;

            // 如果正在从外部更新，不触发 onChange
            if (isUpdatingRef.current) return;

            // 编辑器内容变化，同步到外部
            const markdown = jsonToMarkdown(editor.getJSON());
            onChange(markdown);
          }}
          editorProps={{
            attributes: {
              class:
                "prose prose-sm max-w-none focus:outline-none min-h-[500px]",
            },
          }}
        />
      </EditorRoot>
    </div>
  );
}

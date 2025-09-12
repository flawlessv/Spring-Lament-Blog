"use client";

/**
 * Markdown 预览组件
 *
 * 渲染 Markdown 内容为 HTML
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export default function MarkdownPreview({
  content,
  className = "",
}: MarkdownPreviewProps) {
  if (!content.trim()) {
    return (
      <div className={`text-muted-foreground text-center py-8 ${className}`}>
        暂无内容预览
      </div>
    );
  }

  return (
    <div
      className={`prose prose-gray dark:prose-invert max-w-none ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 自定义代码块渲染
          code({ children, className, ...props }) {
            return (
              <code
                className={`text-sm bg-muted px-1 py-0.5 rounded font-mono ${className || ""}`}
                {...props}
              >
                {children}
              </code>
            );
          },
          // 自定义链接渲染
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline"
            >
              {children}
            </a>
          ),
          // 自定义表格渲染
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border px-4 py-2 bg-muted font-medium text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

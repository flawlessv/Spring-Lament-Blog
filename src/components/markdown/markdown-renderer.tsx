/**
 * Markdown 渲染器组件
 *
 * 功能特性：
 * 1. 将 Markdown 文本转换为格式化的 HTML 内容
 * 2. 支持 GitHub Flavored Markdown (表格、删除线、任务列表等)
 * 3. 代码语法高亮（基于 highlight.js）
 * 4. 自动生成文章目录 (Table of Contents)
 * 5. 支持章节跳转和滚动高亮
 * 6. 响应式设计：移动端折叠目录，桌面端浮动目录
 *
 * 使用的第三方库：
 * - react-markdown: Markdown 解析和渲染
 * - remark-gfm: GitHub Flavored Markdown 支持
 * - rehype-highlight: 代码语法高亮
 * - rehype-raw: 原始 HTML 支持
 * - lucide-react: 图标库
 */

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { List, ChevronRight, Copy, Check } from "lucide-react";

// Import specific languages to reduce bundle size
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import css from "react-syntax-highlighter/dist/cjs/languages/prism/css";
import scss from "react-syntax-highlighter/dist/cjs/languages/prism/scss";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import java from "react-syntax-highlighter/dist/cjs/languages/prism/java";
import sql from "react-syntax-highlighter/dist/cjs/languages/prism/sql";
import yaml from "react-syntax-highlighter/dist/cjs/languages/prism/yaml";
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";

// Register languages
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("scss", scss);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("markdown", markdown);

import Mermaid from "./mermaid";
import CodeBlock from "./code-block";

// 组件属性接口定义
interface MarkdownRendererProps {
  content: string | undefined; // 要渲染的 Markdown 文本内容，可能为空
  showToc?: boolean; // 是否显示目录（Table of Contents），默认为 true
}

// 目录项数据结构
interface TocItem {
  id: string; // 标题的唯一标识符，用于页面内跳转
  text: string; // 标题的文本内容
  level: number; // 标题级别（1-6，对应 h1-h6）
}

export default function MarkdownRenderer({
  content,
  showToc = true,
}: MarkdownRendererProps) {
  // 确保 content 不为空，提供默认值
  const safeContent = content || "";
  // 状态管理
  const [activeHeading, setActiveHeading] = useState<string>(""); // 当前激活的标题 ID
  const [tocOpen, setTocOpen] = useState(false); // 移动端目录是否展开

  // 使用 useMemo 优化性能，只在 content 变化时重新计算目录
  const toc = useMemo(() => {
    // 正则表达式：匹配 Markdown 标题（# ## ### 等）
    // ^(#{1,6}) 匹配行首的1-6个#号
    // \s+ 匹配空格
    // (.+)$ 匹配标题文本直到行尾
    // gm 标志：g=全局匹配，m=多行模式
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: TocItem[] = [];
    let match;

    // 循环匹配所有标题
    while ((match = headingRegex.exec(safeContent)) !== null) {
      const level = match[1].length; // #号的数量就是标题级别
      const text = match[2].trim(); // 标题文本，去除首尾空格

      // 生成 URL 友好的 ID：
      // 1. 转为小写
      // 2. 保留字母、数字、中文、空格和连字符
      // 3. 将空格替换为连字符
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5\s-]/g, "") // 移除特殊字符，保留中文
        .replace(/\s+/g, "-"); // 空格替换为连字符

      headings.push({ id, text, level });
    }

    return headings;
  }, [safeContent]); // 依赖数组：只有 content 变化时才重新计算

  // 使用 useEffect 监听滚动事件，实现目录高亮功能
  useEffect(() => {
    const handleScroll = () => {
      // 获取页面中所有的标题元素
      const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      // 当前滚动位置，加上100px的偏移量（避免标题刚好在顶部时的边界问题）
      const scrollTop = window.scrollY + 100;

      // 从最后一个标题开始向前检查，找到当前应该高亮的标题
      // 这样可以确保找到的是用户正在阅读的章节
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i] as HTMLElement;
        // 如果标题的位置在当前滚动位置之上，说明用户正在阅读这个章节
        if (heading.offsetTop <= scrollTop) {
          setActiveHeading(heading.id); // 更新激活的标题 ID
          break;
        }
      }
    };

    // 添加滚动事件监听器
    window.addEventListener("scroll", handleScroll);
    // 组件挂载时立即执行一次，设置初始状态
    handleScroll();

    // 清理函数：组件卸载时移除事件监听器，防止内存泄漏
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // 空依赖数组：只在组件挂载和卸载时执行

  // 跳转到指定章节的函数
  const scrollToHeading = (id: string) => {
    // 根据 ID 查找对应的 DOM 元素
    const element = document.getElementById(id);
    if (element) {
      // 使用平滑滚动效果跳转到目标元素
      // behavior: "smooth" - 平滑滚动动画
      // block: "start" - 元素顶部对齐到视口顶部
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      // 跳转后关闭移动端的目录面板
      setTocOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* 移动端目录按钮 - 只有在需要显示目录且存在标题时才显示 */}
      {showToc && toc.length > 0 && (
        <div className="mb-6">
          {/* 目录切换按钮 */}
          <button
            onClick={() => setTocOpen(!tocOpen)} // 切换目录面板的显示状态
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
          >
            <List className="w-4 h-4" /> {/* 列表图标 */}
            <span>目录</span>
            {/* 展开/收起指示箭头，根据 tocOpen 状态旋转 */}
            <ChevronRight
              className={`w-4 h-4 transition-transform ${tocOpen ? "rotate-90" : ""}`}
            />
          </button>

          {/* 目录内容面板 - 只有在 tocOpen 为 true 时才显示 */}
          {tocOpen && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <nav className="space-y-1">
                {/* 遍历目录项，为每个标题创建一个按钮 */}
                {toc.map((item) => (
                  <button
                    key={item.id} // 使用标题 ID 作为 React key
                    onClick={() => scrollToHeading(item.id)} // 点击时跳转到对应章节
                    className={`block w-full text-left px-2 py-1 text-sm rounded transition-colors ${
                      // 根据是否为当前激活标题应用不同样式
                      activeHeading === item.id
                        ? "bg-blue-100 text-blue-700" // 激活状态：蓝色背景和文字
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100" // 普通状态：灰色文字，悬停时变深
                    }`}
                    // 根据标题级别设置左边距，实现层级缩进效果
                    // level 1 -> 8px, level 2 -> 20px, level 3 -> 32px, 以此类推
                    style={
                      {
                        paddingLeft: `${(item.level - 1) * 12 + 8}px`,
                      } as React.CSSProperties
                    }
                  >
                    {item.text} {/* 显示标题文本 */}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      )}

      {/* Markdown 内容渲染区域 */}
      <div
        className="prose prose-lg prose-gray max-w-none 
        prose-headings:text-gray-900 prose-headings:font-semibold
        prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-2
        prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6 
        prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5
        prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-4
        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
        prose-li:text-gray-700 prose-li:mb-1
        prose-strong:text-gray-900 prose-strong:font-semibold
        prose-code:text-pink-600 prose-code:font-mono prose-code:text-sm
        prose-pre:bg-transparent prose-pre:p-0
        prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:text-gray-700
        prose-table:text-sm
        prose-th:bg-gray-50 prose-th:border-gray-300 prose-th:font-medium
        prose-td:border-gray-300
      "
      >
        <ReactMarkdown
          // remark 插件：处理 Markdown 语法解析阶段
          remarkPlugins={[remarkGfm]} // 支持 GitHub Flavored Markdown 扩展语法
          // rehype 插件：处理 HTML 输出阶段
          rehypePlugins={[rehypeRaw]} // 原始HTML支持
          // 自定义组件：覆盖默认的 HTML 元素渲染
          components={{
            // 自定义 h1 标题渲染 - 为每个标题添加唯一 ID 以支持锚点跳转
            h1: ({ children, ...props }) => {
              // 提取标题文本内容
              const text = children?.toString() || "";
              // 生成 URL 友好的 ID（与目录生成逻辑保持一致）
              const id = text
                .toLowerCase()
                .replace(/[^\w\u4e00-\u9fa5\s-]/g, "") // 保留字母、数字、中文、空格、连字符
                .replace(/\s+/g, "-"); // 空格转连字符
              return (
                <h1
                  id={id} // 设置 ID 用于锚点跳转
                  className="scroll-mt-20" // 滚动时顶部留出20的空间，避免被固定导航遮挡
                  {...props}
                >
                  {children}
                </h1>
              );
            },
            // h2-h6 标题渲染（逻辑与 h1 相同，为了避免重复，这里简化注释）
            h2: ({ children, ...props }) => {
              const text = children?.toString() || "";
              const id = text
                .toLowerCase()
                .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
                .replace(/\s+/g, "-");
              return (
                <h2 id={id} className="scroll-mt-20" {...props}>
                  {children}
                </h2>
              );
            },
            h3: ({ children, ...props }) => {
              const text = children?.toString() || "";
              const id = text
                .toLowerCase()
                .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
                .replace(/\s+/g, "-");
              return (
                <h3 id={id} className="scroll-mt-20" {...props}>
                  {children}
                </h3>
              );
            },
            h4: ({ children, ...props }) => {
              const text = children?.toString() || "";
              const id = text
                .toLowerCase()
                .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
                .replace(/\s+/g, "-");
              return (
                <h4 id={id} className="scroll-mt-20" {...props}>
                  {children}
                </h4>
              );
            },
            h5: ({ children, ...props }) => {
              const text = children?.toString() || "";
              const id = text
                .toLowerCase()
                .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
                .replace(/\s+/g, "-");
              return (
                <h5 id={id} className="scroll-mt-20" {...props}>
                  {children}
                </h5>
              );
            },
            h6: ({ children, ...props }) => {
              const text = children?.toString() || "";
              const id = text
                .toLowerCase()
                .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
                .replace(/\s+/g, "-");
              return (
                <h6 id={id} className="scroll-mt-20" {...props}>
                  {children}
                </h6>
              );
            },
            // 自定义代码渲染 - 支持代码块、行内代码和 Mermaid 图表
            code: ({ className, children, ...props }: any) => {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";
              const code = String(children).replace(/\n$/, "");
              const isInline = !match;

              // 行内代码：如 `console.log()`
              if (isInline) {
                return (
                  <code
                    className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              // Mermaid 图表
              if (language === "mermaid") {
                return (
                  <Mermaid
                    chart={code}
                    id={Math.random().toString(36).substr(2, 9)}
                  />
                );
              }

              // 代码块
              return <CodeBlock className={className}>{code}</CodeBlock>;
            },
            // 自定义链接样式 - 外部链接在新窗口打开
            a: ({ children, ...props }) => (
              <a
                className="text-blue-600 hover:text-blue-700 underline"
                target="_blank" // 在新窗口打开链接
                rel="noopener noreferrer" // 安全属性：防止新窗口访问原窗口对象
                {...props}
              >
                {children}
              </a>
            ),
            // 自定义表格样式 - 响应式表格，支持水平滚动
            table: ({ children, ...props }) => (
              <div className="overflow-x-auto">
                {" "}
                {/* 水平滚动容器，防止表格在小屏幕上溢出 */}
                <table className="min-w-full border border-gray-200" {...props}>
                  {children}
                </table>
              </div>
            ),
            // 表格头部单元格样式
            th: ({ children, ...props }) => (
              <th
                className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-left font-medium text-gray-900"
                {...props}
              >
                {children}
              </th>
            ),
            // 表格数据单元格样式
            td: ({ children, ...props }) => (
              <td
                className="px-4 py-2 border-b border-gray-200 text-gray-700"
                {...props}
              >
                {children}
              </td>
            ),
            // 自定义引用块样式 - 左侧蓝色边框，浅蓝背景
            blockquote: ({ children, ...props }) => (
              <blockquote
                className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 text-gray-700 italic"
                {...props}
              >
                {children}
              </blockquote>
            ),
          }}
        >
          {content || ""}
        </ReactMarkdown>
      </div>

      {/* 桌面端浮动目录面板 - 只在超宽屏幕(xl)上显示，避免在小屏幕上占用空间 */}
      {showToc && toc.length > 0 && (
        <div className="hidden xl:block fixed right-8 top-1/2 transform -translate-y-1/2 w-64">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3">目录</h4>
            {/* 可滚动的导航区域，最大高度限制防止目录过长 */}
            <nav className="space-y-1 max-h-96 overflow-y-auto">
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={`block w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                    activeHeading === item.id
                      ? "bg-blue-100 text-blue-700" // 当前激活章节的样式
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100" // 普通章节的样式
                  }`}
                  // 根据标题级别设置缩进，桌面端缩进较小（8px间隔）
                  style={
                    {
                      paddingLeft: `${(item.level - 1) * 8 + 8}px`,
                    } as React.CSSProperties
                  }
                >
                  {item.text}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

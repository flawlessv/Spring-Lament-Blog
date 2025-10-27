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

import { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { List, ChevronRight, ChevronDown, ChevronLeft } from "lucide-react";

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
  const [desktopTocCollapsed, setDesktopTocCollapsed] = useState(false); // 桌面端目录是否折叠
  const [readingProgress, setReadingProgress] = useState(0); // 阅读进度

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

  // 使用 useEffect 监听滚动事件，实现目录高亮功能和阅读进度
  useEffect(() => {
    const handleScroll = () => {
      // 获取页面中所有的标题元素
      const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      // 当前滚动位置，加上100px的偏移量（避免标题刚好在顶部时的边界问题）
      const scrollTop = window.scrollY + 100;

      // 计算阅读进度
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(
        100,
        Math.max(0, (window.scrollY / documentHeight) * 100)
      );
      setReadingProgress(progress);

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
    <>
      {/* 顶部阅读进度条 */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="flex gap-8">
        {/* 文章内容区域 */}
        <div className="flex-1">
          {/* 移动端目录切换按钮 */}
          {showToc && toc.length > 0 && (
            <div className="mb-6 xl:hidden">
              <button
                onClick={() => setTocOpen(!tocOpen)}
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 transition-colors"
              >
                <List className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                <span>目录</span>
                <ChevronRight
                  className={`w-4 h-4 text-gray-700 dark:text-gray-300 transition-transform ${tocOpen ? "rotate-90" : ""}`}
                />
              </button>

              {/* 移动端目录内容面板 */}
              {tocOpen && (
                <div className="mt-4 max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                  <nav className="space-y-1 p-3">
                    {toc.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToHeading(item.id)}
                        className={`block w-full text-left py-1.5 px-3 text-sm rounded transition-all truncate ${
                          activeHeading === item.id
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border-l-2 border-blue-600 dark:border-blue-400 font-medium"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                        style={{
                          paddingLeft: `${(item.level - 1) * 10 + 12}px`,
                        }}
                        title={item.text}
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          )}

          {/* Markdown 内容渲染区域 */}
          <div
            className="prose prose-lg prose-gray dark:prose-invert max-w-none font-serif
          prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-headings:font-bold prose-headings:font-sans
          prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:border-b prose-h1:border-gray-200 dark:prose-h1:border-gray-700 prose-h1:pb-3
          prose-h2:text-2xl prose-h2:mb-5 prose-h2:mt-8 prose-h2:text-gray-800 dark:prose-h2:text-gray-200
          prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-6 prose-h3:text-gray-800 dark:prose-h3:text-gray-200
          prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-5 prose-h4:text-gray-800 dark:prose-h4:text-gray-200
          prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
          prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:mb-2 prose-li:leading-relaxed
          prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
          prose-em:text-gray-600 dark:prose-em:text-gray-400 prose-em:italic
          prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:font-mono prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-transparent prose-pre:p-0
          prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:font-serif prose-blockquote:italic
          prose-table:text-sm prose-table:font-sans
          prose-th:bg-gray-50 dark:prose-th:bg-gray-800 prose-th:border-gray-300 dark:prose-th:border-gray-700 prose-th:font-medium
          prose-td:border-gray-300 dark:prose-td:border-gray-700 dark:prose-td:text-gray-300
          prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
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
                code: ({ className, children, node, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || "");
                  const language = match ? match[1] : "text"; // 默认语言为 text
                  const code = String(children).replace(/\n$/, "");

                  // 判断是否为行内代码：
                  // 1. 检查是否有 className（代码块通常有 language-xxx 类名）
                  // 2. 检查代码是否包含换行符（行内代码通常不包含换行）
                  // 3. 检查父节点
                  const hasLanguageClass = /^language-/.test(className || "");
                  const hasNewlines = code.includes("\n");
                  const isCodeBlock =
                    hasLanguageClass ||
                    hasNewlines ||
                    node?.parent?.tagName === "pre";

                  // 行内代码：如 `console.log()`
                  if (!isCodeBlock) {
                    return (
                      <code
                        className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono"
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

                  // 代码块（包括没有指定语言的代码块）
                  return (
                    <CodeBlock className={className || "language-text"}>
                      {code}
                    </CodeBlock>
                  );
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
                    <table
                      className="min-w-full border border-gray-200"
                      {...props}
                    >
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
        </div>

        {/* 桌面端右侧目录 */}
        {showToc && toc.length > 0 && (
          <div
            className={`hidden xl:block flex-shrink-0 pl-4 transition-all duration-300 ${
              desktopTocCollapsed ? "w-8" : "w-56"
            }`}
          >
            <div className="sticky top-24 max-h-[calc(100vh-6rem)]">
              {/* 目录折叠按钮 */}
              <div className="flex items-center justify-between mb-4">
                {!desktopTocCollapsed && (
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                    目录
                  </h4>
                )}
                <button
                  onClick={() => setDesktopTocCollapsed(!desktopTocCollapsed)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                  title={desktopTocCollapsed ? "展开目录" : "折叠目录"}
                >
                  {desktopTocCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100" />
                  ) : (
                    <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100" />
                  )}
                </button>
              </div>

              {/* 目录内容 */}
              {!desktopTocCollapsed && (
                <div className="overflow-y-auto max-h-[calc(100vh-12rem)] pr-2">
                  <nav className="space-y-0.5 animate-in fade-in duration-200">
                    {toc.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToHeading(item.id)}
                        className={`block w-full text-left py-1 px-2 text-sm rounded transition-all truncate ${
                          activeHeading === item.id
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border-l-2 border-blue-600 dark:border-blue-400 font-medium"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                        style={{
                          paddingLeft: `${(item.level - 1) * 10 + 8}px`,
                        }}
                        title={item.text}
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

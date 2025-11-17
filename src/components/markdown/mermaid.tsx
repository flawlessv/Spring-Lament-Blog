"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import mermaid from "mermaid";

interface MermaidProps {
  chart: string;
  id: string;
}

// 全局缓存已渲染的图表
const mermaidCache = new Map<string, { svg: string; theme: string }>();

export default function Mermaid({ chart, id }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isDark, setIsDark] = useState(false);
  const renderAttempted = useRef(false);

  // 检测主题 - 使用useMemo优化
  const currentTheme = useMemo(() => {
    if (typeof window === "undefined") return "default";
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "default";
  }, []);

  // 只在组件挂载时设置主题检测
  useEffect(() => {
    setIsDark(currentTheme === "dark");

    const checkTheme = () => {
      const newIsDark = document.documentElement.classList.contains("dark");
      setIsDark(newIsDark);
    };

    // 观察主题变化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []); // 只在挂载时执行一次

  // 初始化Mermaid - 只在主题变化时重新初始化
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: isDark ? "dark" : "default",
      securityLevel: "loose",
      themeVariables: isDark
        ? {
            primaryColor: "#1f2937",
            primaryBorderColor: "#4b5563",
            primaryTextColor: "#f3f4f6",
            lineColor: "#6b7280",
            secondBkgColor: "#111827",
            tertiaryTextColor: "#d1d5db",
          }
        : undefined,
    });
  }, [isDark]);

  // 渲染图表 - 添加缓存机制
  useEffect(() => {
    const renderChart = async () => {
      if (!chart || renderAttempted.current) return;

      const theme = isDark ? "dark" : "default";
      const cacheKey = `${chart}-${theme}`;

      // 检查缓存
      const cached = mermaidCache.get(cacheKey);
      if (cached) {
        setSvg(cached.svg);
        setError("");
        return;
      }

      renderAttempted.current = true;

      try {
        setError("");
        const { svg: renderedSvg } = await mermaid.render(
          `mermaid-${id}-${Date.now()}`, // 添加时间戳确保唯一性
          chart
        );

        // 存入缓存
        mermaidCache.set(cacheKey, { svg: renderedSvg, theme });
        setSvg(renderedSvg);
      } catch (err) {
        console.error("Mermaid render error:", err);
        setError("Failed to render diagram");
      } finally {
        renderAttempted.current = false;
      }
    };

    renderChart();
  }, [chart, id, isDark]);

  // 清理缓存（可选）- 防止内存泄漏
  useEffect(() => {
    return () => {
      // 如果缓存太大，清理一些旧的条目
      if (mermaidCache.size > 50) {
        const entries = Array.from(mermaidCache.entries());
        // 保留最新的20个
        mermaidCache.clear();
        entries.slice(-20).forEach(([key, value]) => {
          mermaidCache.set(key, value);
        });
      }
    };
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-600 dark:text-red-400 text-sm">
          图表渲染失败: {error}
        </p>
        <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
          {chart}
        </pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="flex justify-center items-center my-4 h-20">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <div className="w-4 h-4 border-2 border-border border-t-foreground rounded-full animate-spin"></div>
          <span className="text-sm">渲染图表中...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="flex justify-center my-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

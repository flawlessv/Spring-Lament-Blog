"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidProps {
  chart: string;
  id: string;
}

export default function Mermaid({ chart, id }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isDark, setIsDark] = useState(false);

  // 检测主题
  useEffect(() => {
    const checkTheme = () => {
      const html = document.documentElement;
      setIsDark(html.classList.contains("dark"));
    };

    // 初始检查
    checkTheme();

    // 观察主题变化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

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

  useEffect(() => {
    const renderChart = async () => {
      if (ref.current && chart) {
        try {
          setError("");
          const { svg: renderedSvg } = await mermaid.render(
            `mermaid-${id}`,
            chart
          );
          setSvg(renderedSvg);
        } catch (err) {
          console.error("Mermaid render error:", err);
          setError("Failed to render diagram");
        }
      }
    };

    renderChart();
  }, [chart, id, isDark]);

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

  return (
    <div
      ref={ref}
      className="flex justify-center my-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

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

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
    });
  }, []);

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
  }, [chart, id]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm">图表渲染失败: {error}</p>
        <pre className="mt-2 text-xs text-gray-600 overflow-x-auto">
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

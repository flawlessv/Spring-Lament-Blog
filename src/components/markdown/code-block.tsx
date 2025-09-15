"use client";

import { useState, useCallback } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  children: string;
  className?: string;
}

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const language = className?.replace(/language-/, "") || "text";
  const code = String(children).replace(/\n$/, "");

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  }, [code]);

  return (
    <div className="relative group">
      {/* Copy button */}
      <button
        onClick={copyToClipboard}
        className="absolute top-3 right-3 p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors opacity-0 group-hover:opacity-100 z-10"
        title="复制代码"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
        showLineNumbers={code.split("\n").length > 5}
        wrapLines={true}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

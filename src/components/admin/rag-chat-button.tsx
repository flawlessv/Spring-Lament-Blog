"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { MessageSquare, Database, Check, AlertCircle } from "lucide-react";

interface IndexStatus {
  totalPosts: number;
  indexedPosts: number;
  needsIndex: boolean;
  lastIndexed: string | null;
}

interface RAGChatProps {
  trigger: React.ReactNode;
}

// 动态导入 RAGChat 组件避免服务端渲染问题
const RAGChat = dynamic(() => import("./rag-chat"), {
  ssr: false,
}) as React.ComponentType<RAGChatProps>;

export default function RAGChatButton() {
  const [indexStatus, setIndexStatus] = useState<IndexStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/ai/rag/index");
        if (res.ok) {
          const data = await res.json();
          setIndexStatus(data);
        }
      } catch (error) {
        console.error("获取索引状态失败:", error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();

    // 每 30 秒刷新一次状态
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (loading) return null;
    if (!indexStatus) return null;

    if (indexStatus.needsIndex) {
      return (
        <div className="relative">
          <AlertCircle className="h-3.5 w-3.5 text-gray-500" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500"></span>
          </span>
        </div>
      );
    }

    if (indexStatus.indexedPosts > 0) {
      return <Check className="h-3.5 w-3.5 text-gray-400" />;
    }

    return <Database className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  const getStatusTitle = () => {
    if (loading) return "加载中...";
    if (!indexStatus) return "知识库问答";

    if (indexStatus.needsIndex) {
      return `${indexStatus.totalPosts - indexStatus.indexedPosts} 篇文章待索引`;
    }

    if (indexStatus.indexedPosts > 0) {
      return `已索引 ${indexStatus.indexedPosts} 篇文章`;
    }

    return "知识库问答";
  };

  return (
    <RAGChat
      trigger={
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 gap-1.5"
          title={getStatusTitle()}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">知识问答</span>
          {getStatusIcon()}
        </Button>
      }
    />
  );
}

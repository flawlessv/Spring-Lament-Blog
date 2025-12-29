"use client";

import { useEffect } from "react";

/**
 * 自动索引组件
 * 在管理后台加载时自动检查并索引已发布的文章
 */
export default function AutoIndexer() {
  useEffect(() => {
    const autoIndex = async () => {
      try {
        // 1. 检查索引状态
        const statusRes = await fetch("/api/ai/rag/index");
        if (!statusRes.ok) return;

        const status = await statusRes.json();

        // 2. 如果需要索引,则自动触发
        if (status.needsIndex) {
          console.log(
            `[自动索引] 发现 ${status.totalPosts - status.indexedPosts} 篇文章未索引，开始自动索引...`
          );

          // 异步执行,不阻塞页面
          fetch("/api/ai/rag/index", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ all: true, force: false }),
          })
            .then((res) => res.json())
            .then((result) => {
              if (result.success) {
                console.log(
                  `[自动索引] 完成: ${result.indexed} 成功, ${result.skipped} 跳过, ${result.failed} 失败`
                );
              } else {
                console.error("[自动索引] 失败:", result.message);
              }
            })
            .catch((error) => {
              console.error("[自动索引] 错误:", error);
            });
        } else {
          console.log(
            `[自动索引] 索引已是最新 (${status.indexedPosts}/${status.totalPosts})`
          );
        }
      } catch (error) {
        console.error("[自动索引] 检查失败:", error);
      }
    };

    // 延迟 3 秒执行,避免阻塞页面加载
    const timer = setTimeout(() => {
      autoIndex();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return null; // 这个组件不渲染任何内容
}

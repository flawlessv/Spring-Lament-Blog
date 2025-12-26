"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ChevronRight, Loader2 } from "lucide-react";

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
}

interface RelatedPostsProps {
  slug: string;
  limit?: number;
}

export default function RelatedPosts({ slug, limit = 3 }: RelatedPostsProps) {
  const [posts, setPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"vector" | "category" | "tags">("category");

  useEffect(() => {
    async function fetchRelatedPosts() {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts/${slug}/related?limit=${limit}`);
        if (!res.ok) throw new Error("获取失败");

        const data = await res.json();
        setPosts((data.posts || []).slice(0, limit));
        setMode(data.mode || "category");
      } catch (error) {
        console.error("获取相关文章失败:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedPosts();
  }, [slug, limit]);

  if (loading) {
    return (
      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          <span className="ml-2 text-sm text-gray-500">加载相关文章...</span>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-amber-500" />
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          相关文章
        </h2>
        {mode === "vector" && (
          <span className="text-xs px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded">
            AI
          </span>
        )}
      </div>

      {/* 文章列表 */}
      <ul className="space-y-1.5">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/posts/${post.slug}`}
              className="group flex items-center gap-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-amber-500 flex-shrink-0 transition-colors" />
              <span className="line-clamp-1">{post.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

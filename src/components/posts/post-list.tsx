"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
  };
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    color?: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
    color?: string;
  }>;
  commentsCount: number;
}

interface PostListProps {
  className?: string;
}

export default function PostList({ className = "" }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`/api/posts?page=${page}&limit=10`);
        if (response.ok) {
          const data = await response.json();
          if (page === 1) {
            setPosts(data.posts);
          } else {
            setPosts((prev) => [...prev, ...data.posts]);
          }
          setHasMore(data.pagination.current < data.pagination.pages);
        }
      } catch (error) {
        console.error("获取文章列表失败:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [page]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  if (loading && page === 1) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="p-6 bg-white border border-gray-200 rounded-lg animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500">还没有发布任何文章</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {posts.map((post) => (
        <article key={post.id} className="group">
          <Link href={`/posts/${post.slug}`}>
            <div className="p-6 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              {/* 文章标题 */}
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                {post.featured && (
                  <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                )}
                {post.title}
              </h2>

              {/* 文章摘要 */}
              {post.excerpt && (
                <p className="text-gray-600 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
              )}

              {/* 文章信息 */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{post.author.username}</span>
                <span>
                  {format(new Date(post.createdAt), "yyyy年MM月dd日", {
                    locale: zhCN,
                  })}
                </span>
                {post.commentsCount > 0 && (
                  <span>{post.commentsCount} 条评论</span>
                )}
              </div>
            </div>
          </Link>
        </article>
      ))}

      {/* 加载更多 */}
      {hasMore && (
        <div className="text-center pt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-blue-600 hover:text-blue-700 hover:border-gray-300 transition-colors disabled:opacity-50"
          >
            {loading ? "加载中..." : "加载更多"}
          </button>
        </div>
      )}
    </div>
  );
}

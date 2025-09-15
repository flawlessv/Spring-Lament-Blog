"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ImageIcon, Clock, MessageCircle } from "lucide-react";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featured: boolean;
  coverImage?: string;
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
          <div key={i} className="overflow-hidden rounded-lg animate-pulse">
            <div className="flex space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
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
    <div className={`space-y-6 ${className}`}>
      {posts.map((post) => (
        <article key={post.id} className="group">
          <Link href={`/posts/${post.slug}`}>
            <div className="relative h-64 md:h-72 rounded-lg overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
              {/* 背景图片或渐变 */}
              {post.coverImage ? (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${post.coverImage})` }}
                >
                  <div className="absolute inset-0 bg-black/40"></div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600">
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
              )}

              {/* 文章内容覆盖层 */}
              <div className="relative h-full p-8 flex flex-col justify-between text-white">
                {/* 顶部：日期和精选标识 */}
                <div className="flex items-start justify-between">
                  <div className="text-sm opacity-90 font-medium tracking-wider">
                    {format(new Date(post.createdAt), "MMM dd, yyyy", {
                      locale: zhCN,
                    }).toUpperCase()}
                  </div>
                  {post.featured && (
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  )}
                </div>

                {/* 底部：标题和分类 */}
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight line-clamp-2 group-hover:text-blue-200 transition-colors">
                    {post.title}
                  </h2>

                  {/* 分类标签 */}
                  {post.categories.length > 0 && (
                    <div className="flex items-center space-x-3">
                      {post.categories.slice(0, 2).map((category) => (
                        <span
                          key={category.id}
                          className="inline-block px-3 py-1 text-sm bg-white/25 backdrop-blur-sm rounded-full"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </article>
      ))}

      {/* 加载更多 */}
      {hasMore && (
        <div className="text-center pt-8">
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

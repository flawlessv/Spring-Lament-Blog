"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  Calendar,
  User,
  MessageCircle,
  Star,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      <div className={`space-y-6 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6"
          >
            <div className="animate-pulse">
              <div className="flex items-center space-x-2 mb-3">
                <div className="h-3 bg-slate-200 rounded w-16"></div>
                <div className="h-3 bg-slate-200 rounded w-20"></div>
              </div>
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-slate-200 rounded"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-3 bg-slate-200 rounded w-20"></div>
                  <div className="h-3 bg-slate-200 rounded w-16"></div>
                </div>
                <div className="h-3 bg-slate-200 rounded w-12"></div>
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
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            暂无文章
          </h3>
          <p className="text-slate-500">还没有发布任何文章，请稍后再来查看。</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {posts.map((post) => (
        <article
          key={post.id}
          className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200 group"
        >
          {/* 文章标签 */}
          <div className="flex items-center space-x-2 mb-3">
            {post.featured && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                <Star className="h-3 w-3 mr-1" />
                精选
              </Badge>
            )}
            {post.categories.map((category) => (
              <Badge
                key={category.id}
                style={{ backgroundColor: category.color || "#6B7280" }}
                className="text-white text-xs"
              >
                {category.name}
              </Badge>
            ))}
          </div>

          {/* 文章标题 */}
          <Link href={`/posts/${post.slug}`}>
            <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>

          {/* 文章摘要 */}
          {post.excerpt && (
            <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* 标签 */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-slate-100 text-slate-600"
                >
                  #{tag.name}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-slate-500">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 文章信息 */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{post.author.username}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {format(new Date(post.createdAt), "MM月dd日", {
                    locale: zhCN,
                  })}
                </span>
              </div>
              {post.commentsCount > 0 && (
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{post.commentsCount}</span>
                </div>
              )}
            </div>
            <Link
              href={`/posts/${post.slug}`}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>阅读更多</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </article>
      ))}

      {/* 加载更多按钮 */}
      {hasMore && (
        <div className="text-center pt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-3 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-xl text-sm font-medium text-slate-700 hover:bg-white/80 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "加载中..." : "加载更多"}
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { BackgroundImage } from "@/components/optimized/image-with-fallback";

// 类型定义
interface PostListProps {
  className?: string;
  categorySlug?: string;
  initialPosts?: Post[];
  initialHasMore?: boolean;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  createdAt: Date;
  publishedAt?: Date;
  featured: boolean;
  categories: Array<{
    id: string;
    name: string;
  }>;
}

export default function PostList({
  className = "",
  categorySlug,
  initialPosts = [],
  initialHasMore = true,
}: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(initialPosts.length > 0 ? 1 : 1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = useCallback(
    async (pageNum: number) => {
      try {
        if (pageNum > 1) setLoadingMore(true);

        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "10",
        });

        if (categorySlug) {
          params.append("category", categorySlug);
        }

        const response = await fetch(`/api/posts?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          if (pageNum === 1) {
            setPosts(data.posts);
          } else {
            setPosts((prev) => [...prev, ...data.posts]);
          }
          setHasMore(data.pagination.current < data.pagination.pages);
        }
      } catch (error) {
        console.error("获取文章列表失败:", error);
      } finally {
        setLoadingMore(false);
      }
    },
    [categorySlug]
  );

  useEffect(() => {
    if (initialPosts.length === 0) {
      fetchPosts(page);
    }
  }, [page, fetchPosts, initialPosts]);

  // 当分类变化时重置页面并重新加载
  useEffect(() => {
    if (categorySlug !== undefined && initialPosts.length === 0) {
      setPage(1);
      setHasMore(true);
      fetchPosts(1);
    }
  }, [categorySlug, fetchPosts, initialPosts]);

  // 滚动监听自动加载
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        hasMore &&
        !loadingMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore]);

  if (!posts.length) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-500">还没有发布任何文章</p>
      </div>
    );
  }

  return (
    <div className={`space-y-[60px] sm:space-y-[60px] ${className}`}>
      {posts.map((post, index) => (
        <article key={post.id}>
          <Link
            href={`/posts/${post.slug}`}
            className="block w-full max-w-[680px] mx-auto"
          >
            <div className="relative w-full h-[220px] sm:h-[285px] overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl group">
              {/* 优化的背景图片 */}
              <div className="absolute inset-0">
                <BackgroundImage
                  src={post.coverImage || ""}
                  className="w-full h-full"
                  priority={index < 2} // 前两张图片优先加载
                  fallbackSrc="https://source.unsplash.com/random/800x600"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/70 transition-opacity duration-300 group-hover:from-black/20 group-hover:via-black/30 group-hover:to-black/80"></div>
              </div>

              {/* 文章内容覆盖层 */}
              <div
                className="relative h-full p-4 sm:p-8 flex flex-col justify-between text-white"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
              >
                {/* 顶部：日期和精选标识 */}
                <div className="flex items-start justify-between">
                  <div className="text-xs sm:text-sm opacity-90 font-medium tracking-wider">
                    {format(
                      new Date(post.publishedAt || post.createdAt),
                      "MMM dd, yyyy",
                      {
                        locale: zhCN,
                      }
                    ).toUpperCase()}
                  </div>
                  {post.featured && (
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full shadow-lg"></div>
                  )}
                </div>

                {/* 中间：标题 - 垂直居中 */}
                <div className="flex-1 flex items-center">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight line-clamp-3 transition-all duration-300 group-hover:scale-[1.02]">
                    {post.title}
                  </h2>
                </div>

                {/* 底部：分类标签 */}
                {post.categories.length > 0 && (
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {post.categories.slice(0, 2).map((category) => (
                      <span
                        key={category.id}
                        className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm bg-white/25 backdrop-blur-sm rounded-full transition-all duration-300 group-hover:bg-white/35"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        </article>
      ))}

      {/* 自动加载指示器 */}
      {loadingMore && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 text-muted-foreground">
            {/* 简单的旋转圈 */}
            <div className="w-5 h-5 border-2 border-t-primary border-r-primary/50 border-b-transparent border-l-transparent rounded-full animate-spin" />
            <span className="text-sm animate-pulse">永言配命，莫向外求。</span>
          </div>
        </div>
      )}
    </div>
  );
}

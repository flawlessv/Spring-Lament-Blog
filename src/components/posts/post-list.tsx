"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import dynamic from "next/dynamic";

// 类型定义
interface PostListProps {
  className?: string;
  categorySlug?: string;
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

// 动态导入优化的图片组件，减少初始包大小
const BackgroundImage = dynamic(
  () =>
    import("@/components/optimized/image-with-fallback").then(
      (mod) => mod.BackgroundImage
    ),
  {
    loading: () => <div className="w-full h-full bg-gray-200 animate-pulse" />,
    ssr: false,
  }
);

export default function PostList({
  className = "",
  categorySlug,
}: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [categorySlug]
  );

  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  // 当分类变化时重置页面并重新加载
  useEffect(() => {
    // 避免初始化时重复加载
    if (categorySlug !== undefined) {
      setPage(1);
      setHasMore(true);
      setLoading(true);
      // 不立即清空posts，等新数据加载完成后再更新，减少页面抖动
      fetchPosts(1);
    }
  }, [categorySlug, fetchPosts]);

  // 滚动监听自动加载
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        hasMore &&
        !loading &&
        !loadingMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, loadingMore]);

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
    <div className={`space-y-[60px] ${className}`}>
      {posts.map((post, index) => (
        <article key={post.id}>
          <Link href={`/posts/${post.slug}`}>
            <div className="relative w-full max-w-[680px] h-[285px] mx-auto overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl group">
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
                className="relative h-full p-8 flex flex-col justify-between text-white"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
              >
                {/* 顶部：日期和精选标识 */}
                <div className="flex items-start justify-between">
                  <div className="text-sm opacity-90 font-medium tracking-wider">
                    {format(
                      new Date(post.publishedAt || post.createdAt),
                      "MMM dd, yyyy",
                      {
                        locale: zhCN,
                      }
                    ).toUpperCase()}
                  </div>
                  {post.featured && (
                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
                  )}
                </div>

                {/* 中间：标题 - 垂直居中 */}
                <div className="flex-1 flex items-center">
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight line-clamp-3 transition-all duration-300 group-hover:scale-[1.02]">
                    {post.title}
                  </h2>
                </div>

                {/* 底部：分类标签 */}
                {post.categories.length > 0 && (
                  <div className="flex items-center space-x-3">
                    {post.categories.slice(0, 2).map((category) => (
                      <span
                        key={category.id}
                        className="inline-block px-3 py-1 text-sm bg-white/25 backdrop-blur-sm rounded-full transition-all duration-300 group-hover:bg-white/35"
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
          <div className="inline-flex items-center space-x-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-border border-t-foreground rounded-full animate-spin"></div>
            <span className="text-sm">加载中...</span>
          </div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">没有更多文章了</p>
        </div>
      )}
    </div>
  );
}

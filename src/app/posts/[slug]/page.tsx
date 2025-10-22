import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

import PublicLayout from "@/components/layout/public-layout";
import MarkdownRenderer from "@/components/markdown/markdown-renderer";

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    profile?: {
      displayName?: string;
      avatar?: string;
    };
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

async function getPost(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:7777"}/api/posts/${slug}`,
      {
        cache: "no-store", // 确保获取最新数据
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.post;
  } catch (error) {
    console.error("获取文章详情失败:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "文章不存在 - SpringLament Blog",
    };
  }

  return {
    title: `${post.title} - SpringLament Blog`,
    description: post.excerpt || "SpringLament Blog 文章详情",
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <PublicLayout>
      {/* 文章头部 */}
      <header className="mb-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>返回1234</span>
          </Link>
        </div>

        {/* 标题 */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight font-sans">
          {post.featured && (
            <span className="inline-flex items-center mr-4">
              <span className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></span>
              <span className="ml-2 text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                精选
              </span>
            </span>
          )}
          {post.title}
        </h1>

        {/* 文章信息 */}
        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            {post.author.profile?.avatar ? (
              <div className="relative w-8 h-8">
                <Image
                  src={post.author.profile.avatar}
                  alt={post.author.profile?.displayName || post.author.username}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                  sizes="32px"
                  quality={80}
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {(post.author.profile?.displayName || post.author.username)
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
            <span className="font-medium">
              {post.author.profile?.displayName || post.author.username}
            </span>
          </div>
          <span className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              {format(new Date(post.createdAt), "yyyy年MM月dd日", {
                locale: zhCN,
              })}
            </span>
          </span>
          {post.commentsCount > 0 && (
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{post.commentsCount} 条评论</span>
            </span>
          )}
        </div>

        {/* 摘要 */}
        {post.excerpt && (
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg mb-8 border border-slate-200 dark:border-slate-800">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
              {post.excerpt}
            </p>
          </div>
        )}
      </header>

      {/* 文章内容 */}
      <article className="mb-16">
        <MarkdownRenderer content={post.content || "暂无内容"} showToc={true} />
      </article>

      {/* 底部导航 */}
      <div className="pt-8 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              最后更新:{" "}
              {format(new Date(post.updatedAt), "yyyy年MM月dd日", {
                locale: zhCN,
              })}
            </span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors group"
          >
            查看更多文章
            <span className="ml-2 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  Calendar,
  User,
  ArrowLeft,
  Tag,
  Folder,
  MessageCircle,
  Star,
} from "lucide-react";
import PublicLayout from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";

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
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);

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
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <PublicLayout>
      {/* 返回链接 */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 transition-colors"
        >
          ← 返回首页
        </Link>
      </div>

      {/* 文章头部 */}
      <header className="mb-12">
        {/* 标题 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {post.featured && (
            <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
          )}
          {post.title}
        </h1>

        {/* 文章信息 */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
          <span>{post.author.username}</span>
          <span>
            {format(new Date(post.createdAt), "yyyy年MM月dd日", {
              locale: zhCN,
            })}
          </span>
          {post.commentsCount > 0 && <span>{post.commentsCount} 条评论</span>}
        </div>

        {/* 摘要 */}
        {post.excerpt && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <p className="text-gray-700 leading-relaxed italic">
              {post.excerpt}
            </p>
          </div>
        )}
      </header>

      {/* 文章内容 */}
      <article className="prose prose-gray max-w-none mb-12">
        <div
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content || "暂无内容" }}
        />
      </article>

      {/* 底部导航 */}
      <div className="pt-8 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            最后更新:{" "}
            {format(new Date(post.updatedAt), "yyyy年MM月dd日", {
              locale: zhCN,
            })}
          </div>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            查看更多文章 →
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}

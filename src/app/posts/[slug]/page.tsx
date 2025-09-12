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
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回首页</span>
          </Link>
        </div>

        {/* 文章头部 */}
        <header className="mb-8">
          {/* 标签 */}
          <div className="flex items-center space-x-2 mb-4">
            {post.featured && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <Star className="h-3 w-3 mr-1" />
                精选文章
              </Badge>
            )}
            {post.categories.map((category) => (
              <Badge
                key={category.id}
                style={{ backgroundColor: category.color || "#6B7280" }}
                className="text-white"
              >
                <Folder className="h-3 w-3 mr-1" />
                {category.name}
              </Badge>
            ))}
          </div>

          {/* 标题 */}
          <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* 文章信息 */}
          <div className="flex items-center space-x-6 text-sm text-slate-600 mb-6">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{post.author.username}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(post.createdAt), "yyyy年MM月dd日", {
                  locale: zhCN,
                })}
              </span>
            </div>
            {post.commentsCount > 0 && (
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>{post.commentsCount} 条评论</span>
              </div>
            )}
          </div>

          {/* 摘要 */}
          {post.excerpt && (
            <div className="bg-slate-50 rounded-xl p-6 mb-8">
              <p className="text-slate-700 leading-relaxed italic">
                {post.excerpt}
              </p>
            </div>
          )}
        </header>

        {/* 文章内容 */}
        <article className="prose prose-slate max-w-none">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-8">
            <div
              className="prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-code:text-slate-800 prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-blockquote:border-l-blue-500 prose-blockquote:text-slate-600"
              dangerouslySetInnerHTML={{ __html: post.content || "暂无内容" }}
            />
          </div>
        </article>

        {/* 标签列表 */}
        {post.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="flex items-center space-x-2 mb-4">
              <Tag className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                相关标签
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 文章导航 */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-500">
              最后更新:{" "}
              {format(new Date(post.updatedAt), "yyyy年MM月dd日 HH:mm", {
                locale: zhCN,
              })}
            </div>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
            >
              <span>查看更多文章</span>
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

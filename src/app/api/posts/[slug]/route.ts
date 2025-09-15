import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 获取单篇文章详情
 * GET /api/posts/[slug]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const post = await prisma.post.findUnique({
      where: {
        slug,
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "文章不存在或未发布" },
        { status: 404 }
      );
    }

    // 格式化返回数据
    const formattedPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      featured: post.featured,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author,
      categories: post.category ? [post.category] : [],
      tags: post.tags.map((postTag) => postTag.tag),
      commentsCount: 0,
    };

    return NextResponse.json({ post: formattedPost });
  } catch (error) {
    console.error("获取文章详情失败:", error);
    return NextResponse.json({ error: "获取文章详情失败" }, { status: 500 });
  }
}

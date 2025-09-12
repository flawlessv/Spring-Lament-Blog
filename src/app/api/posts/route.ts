import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 获取公开发布的文章列表
 * GET /api/posts
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {
      published: true,
    };

    if (category) {
      where.categories = {
        some: {
          slug: category,
        },
      };
    }

    if (tag) {
      where.tags = {
        some: {
          slug: tag,
        },
      };
    }

    // 获取文章列表
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // 获取总数
    const total = await prisma.post.count({
      where: {
        published: true,
      },
    });

    // 格式化返回数据
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      featured: post.featured,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author,
      categories: [],
      tags: [],
      commentsCount: 0,
    }));

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        current: page,
        pageSize: limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取文章列表失败:", error);
    return NextResponse.json({ error: "获取文章列表失败" }, { status: 500 });
  }
}

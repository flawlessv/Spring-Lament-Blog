/**
 * 文章管理 API 路由
 *
 * 提供文章的 CRUD 操作和批量处理功能
 * 支持筛选、搜索和分页
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// 查询参数验证schema
const querySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10)),
  search: z.string().optional().nullable(),
  status: z
    .enum(["all", "published", "draft", "featured"])
    .optional()
    .default("all"),
  categoryId: z.string().optional().nullable(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "views", "title"])
    .optional()
    .default("updatedAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

/**
 * GET /api/admin/posts
 * 获取文章列表
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // 权限检查
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限访问" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
      status: searchParams.get("status") || "all",
      categoryId: searchParams.get("categoryId"),
      sortBy: searchParams.get("sortBy") || "updatedAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
    });

    // 构建查询条件
    const where: any = {};

    // 搜索条件
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { content: { contains: query.search, mode: "insensitive" } },
        { excerpt: { contains: query.search, mode: "insensitive" } },
      ];
    }

    // 状态筛选
    switch (query.status) {
      case "published":
        where.published = true;
        where.featured = false;
        break;
      case "draft":
        where.published = false;
        break;
      case "featured":
        where.featured = true;
        break;
    }

    // 分类筛选
    if (query.categoryId && query.categoryId !== "all") {
      where.categoryId = query.categoryId;
    }

    // 排序配置
    const orderBy: any = {};
    orderBy[query.sortBy] = query.sortOrder;

    // 分页配置
    const skip = (query.page - 1) * query.limit;

    // 查询文章数据
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy,
        skip,
        take: query.limit,
        include: {
          author: {
            include: {
              profile: true,
            },
          },
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    // 格式化数据
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      published: post.published,
      featured: post.featured,
      views: post.views,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt,
      author: {
        username: post.author.username,
        displayName: post.author.profile?.displayName,
        profile: post.author.profile,
      },
      category: post.category,
      tags: post.tags.map((pt) => pt.tag),
    }));

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / query.limit),
        hasNextPage: query.page * query.limit < totalCount,
        hasPrevPage: query.page > 1,
      },
    });
  } catch (error) {
    console.error("获取文章列表失败:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

/**
 * POST /api/admin/posts
 * 创建新文章
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限访问" }, { status: 403 });
    }

    const body = await request.json();

    // 创建文章的验证schema
    const createPostSchema = z.object({
      title: z.string().min(1, "标题不能为空"),
      slug: z.string().min(1, "URL slug不能为空"),
      content: z.string().min(1, "内容不能为空"),
      excerpt: z.string().optional(),
      coverImage: z.string().optional(),
      published: z.boolean().default(false),
      featured: z.boolean().default(false),
      categoryId: z.string().optional(),
      tags: z.array(z.string()).optional(),
    });

    const data = createPostSchema.parse(body);

    // 检查slug是否已存在
    const existingPost = await prisma.post.findUnique({
      where: { slug: data.slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "该URL slug已存在，请选择其他" },
        { status: 400 }
      );
    }

    // 创建文章
    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        published: data.published,
        featured: data.featured,
        publishedAt: data.published ? new Date() : null,
        authorId: session.user.id,
        categoryId: data.categoryId || null,
        tags: data.tags
          ? {
              create: data.tags.map((tagId) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        author: {
          include: { profile: true },
        },
        category: true,
        tags: {
          include: { tag: true },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("创建文章失败:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "数据验证失败", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

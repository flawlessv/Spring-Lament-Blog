/**
 * 标签管理 API 路由
 *
 * 提供标签的 CRUD 操作
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// 创建标签的验证schema
const createTagSchema = z.object({
  name: z
    .string()
    .min(1, "标签名称不能为空")
    .max(30, "标签名称不能超过30个字符"),
  slug: z
    .string()
    .min(1, "URL slug不能为空")
    .max(30, "URL slug不能超过30个字符"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "请输入有效的颜色代码")
    .optional(),
});

// 更新标签的验证schema
const updateTagSchema = createTagSchema.partial();

/**
 * GET /api/admin/tags
 * 获取标签列表
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限访问" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get("includeStats") === "true";
    const search = searchParams.get("search");

    const whereCondition = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { slug: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    if (includeStats) {
      const tagsWithPosts = await prisma.tag.findMany({
        where: whereCondition,
        orderBy: { name: "asc" },
        include: {
          posts: {
            select: {
              id: true,
              post: { select: { published: true } },
            },
          },
        },
      });

      const formattedTags = tagsWithPosts.map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        color: tag.color,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        stats: {
          totalPosts: tag.posts.length,
          publishedPosts: tag.posts.filter((pt) => pt.post.published).length,
        },
      }));

      return NextResponse.json({ tags: formattedTags });
    }

    const tags = await prisma.tag.findMany({
      where: whereCondition,
      orderBy: { name: "asc" },
    });

    const formattedTags = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    }));

    return NextResponse.json({ tags: formattedTags });
  } catch (error) {
    console.error("获取标签列表失败:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

/**
 * POST /api/admin/tags
 * 创建新标签
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限访问" }, { status: 403 });
    }

    const body = await request.json();
    const data = createTagSchema.parse(body);

    // 检查名称和slug是否已存在
    const existing = await prisma.tag.findFirst({
      where: {
        OR: [{ name: data.name }, { slug: data.slug }],
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error:
            existing.name === data.name ? "标签名称已存在" : "URL slug已存在",
        },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.create({
      data,
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("创建标签失败:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "数据验证失败", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/tags/batch
 * 批量删除标签
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限访问" }, { status: 403 });
    }

    const { tagIds } = await request.json();

    if (!Array.isArray(tagIds) || tagIds.length === 0) {
      return NextResponse.json(
        { error: "请选择要删除的标签" },
        { status: 400 }
      );
    }

    // 删除标签关联关系和标签本身（会级联删除）
    const result = await prisma.tag.deleteMany({
      where: {
        id: { in: tagIds },
      },
    });

    return NextResponse.json({
      message: `成功删除 ${result.count} 个标签`,
    });
  } catch (error) {
    console.error("批量删除标签失败:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

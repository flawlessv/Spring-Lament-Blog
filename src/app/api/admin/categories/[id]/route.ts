/**
 * 单个分类的 API 路由
 *
 * 提供分类的获取、更新和删除功能
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// 更新分类的验证schema
const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, "分类名称不能为空")
    .max(50, "分类名称不能超过50个字符")
    .optional(),
  slug: z
    .string()
    .min(1, "URL slug不能为空")
    .max(50, "URL slug不能超过50个字符")
    .optional(),
  description: z.string().max(200, "描述不能超过200个字符").optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "请输入有效的颜色代码")
    .optional(),
  icon: z.string().max(50, "图标不能超过50个字符").optional(),
  sortOrder: z.number().int().min(0).optional(),
});

/**
 * GET /api/admin/categories/[id]
 * 获取单个分类详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限访问" }, { status: 403 });
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            published: true,
            createdAt: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("获取分类详情失败:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/categories/[id]
 * 更新分类
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限访问" }, { status: 403 });
    }

    const body = await request.json();
    const data = updateCategorySchema.parse(body);

    // 检查分类是否存在
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 });
    }

    // 如果更新了名称或slug，检查是否与其他分类重复
    if (data.name || data.slug) {
      const conflicts = await prisma.category.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                data.name ? { name: data.name } : {},
                data.slug ? { slug: data.slug } : {},
              ].filter((condition) => Object.keys(condition).length > 0),
            },
          ],
        },
      });

      if (conflicts) {
        const conflictField =
          conflicts.name === data.name ? "名称" : "URL slug";
        return NextResponse.json(
          { error: `分类${conflictField}已存在` },
          { status: 400 }
        );
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("更新分类失败:", error);

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
 * DELETE /api/admin/categories/[id]
 * 删除分类
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限访问" }, { status: 403 });
    }

    // 检查分类是否存在
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        posts: { select: { id: true } },
      },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 });
    }

    // 检查是否有关联的文章
    if (existingCategory.posts.length > 0) {
      return NextResponse.json(
        {
          error: "无法删除分类",
          message: `该分类下还有 ${existingCategory.posts.length} 篇文章，请先移除或重新分类这些文章`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "分类删除成功" });
  } catch (error) {
    console.error("删除分类失败:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

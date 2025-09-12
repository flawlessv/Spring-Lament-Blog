/**
 * 单个标签的 API 路由
 *
 * 提供标签的获取、更新和删除功能
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// 更新标签的验证schema
const updateTagSchema = z.object({
  name: z
    .string()
    .min(1, "标签名称不能为空")
    .max(30, "标签名称不能超过30个字符")
    .optional(),
  slug: z
    .string()
    .min(1, "URL slug不能为空")
    .max(30, "URL slug不能超过30个字符")
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "请输入有效的颜色代码")
    .optional(),
});

/**
 * GET /api/admin/tags/[id]
 * 获取单个标签详情
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

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        posts: {
          include: {
            post: {
              select: {
                id: true,
                title: true,
                slug: true,
                published: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json({ error: "标签不存在" }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error("获取标签详情失败:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/tags/[id]
 * 更新标签
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
    const data = updateTagSchema.parse(body);

    // 检查标签是否存在
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      return NextResponse.json({ error: "标签不存在" }, { status: 404 });
    }

    // 如果更新了名称或slug，检查是否与其他标签重复
    if (data.name || data.slug) {
      const conflicts = await prisma.tag.findFirst({
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
          { error: `标签${conflictField}已存在` },
          { status: 400 }
        );
      }
    }

    const updatedTag = await prisma.tag.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error("更新标签失败:", error);

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
 * DELETE /api/admin/tags/[id]
 * 删除标签
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

    // 检查标签是否存在
    const existingTag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      return NextResponse.json({ error: "标签不存在" }, { status: 404 });
    }

    // 删除标签（关联的文章标签关系会通过 Cascade 自动删除）
    await prisma.tag.delete({
      where: { id },
    });

    return NextResponse.json({ message: "标签删除成功" });
  } catch (error) {
    console.error("删除标签失败:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}

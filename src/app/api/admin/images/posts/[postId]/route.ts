/**
 * 获取文章图片列表 API
 *
 * GET /api/admin/images/[postId]
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ImageType } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    // 权限验证
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { postId } = await params;

    // 查询文章是否存在
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, slug: true, title: true },
    });

    if (!post) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    // 查询文章的所有图片
    const images = await prisma.image.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
    });

    // 分类图片：封面图和内容配图
    const cover =
      images.find((img: { type: ImageType }) => img.type === "COVER") || null;
    const content = images.filter(
      (img: { type: ImageType }) => img.type === "CONTENT"
    );

    return NextResponse.json({
      post: {
        id: post.id,
        slug: post.slug,
        title: post.title,
      },
      cover,
      content,
      total: images.length,
    });
  } catch (error) {
    console.error("获取图片列表失败:", error);
    return NextResponse.json({ error: "获取图片列表失败" }, { status: 500 });
  }
}

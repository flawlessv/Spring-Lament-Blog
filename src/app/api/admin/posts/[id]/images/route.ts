import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 获取文章的图片信息
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        coverImage: true,
        content: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    // 从文章内容中提取所有图片
    const imageRegex = /!\[.*?\]\((\/images\/[^)]+)\)/g;
    const contentImages: string[] = [];
    let match;

    while ((match = imageRegex.exec(post.content || "")) !== null) {
      contentImages.push(match[1]);
    }

    // 去重
    const uniqueImages = Array.from(new Set(contentImages));

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        coverImage: post.coverImage,
      },
      contentImages: uniqueImages,
      totalImages: uniqueImages.length + (post.coverImage ? 1 : 0),
    });
  } catch (error) {
    console.error("获取文章图片失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

// 更新文章封面图
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { coverImage } = body;

    const post = await prisma.post.update({
      where: { id },
      data: { coverImage },
    });

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("更新文章封面失败:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

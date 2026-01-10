import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 获取文章列表（用于图片管理）
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        coverImage: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    // 为每篇文章计算内容中的图片数量
    const postsWithImageCount = posts.map((post) => {
      const imageRegex = /!\[.*?\]\((\/images\/[^)]+)\)/g;
      const contentImages = post.content?.match(imageRegex) || [];
      const imageCount = contentImages.length;

      return {
        ...post,
        imageCount,
        totalImages: imageCount + (post.coverImage ? 1 : 0),
      };
    });

    return NextResponse.json({
      success: true,
      posts: postsWithImageCount,
    });
  } catch (error) {
    console.error("获取文章列表失败:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 获取管理员公开信息
 * GET /api/profile
 */
export async function GET() {
  try {
    // 获取管理员用户信息
    const admin = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "管理员信息不存在" }, { status: 404 });
    }

    // 获取统计信息
    const stats = await prisma.$transaction([
      // 已发布文章数
      prisma.post.count({
        where: {
          published: true,
        },
      }),
      // 分类数
      prisma.category.count(),
      // 标签数
      prisma.tag.count(),
    ]);

    const profile = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      bio: "这个人很懒，什么都没有留下...",
      avatar: "/default-avatar.png",
      joinedAt: admin.createdAt,
      stats: {
        posts: stats[0],
        categories: stats[1],
        tags: stats[2],
      },
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("获取管理员信息失败:", error);
    return NextResponse.json({ error: "获取管理员信息失败" }, { status: 500 });
  }
}

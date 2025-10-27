import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * 获取分类列表
 * GET /api/categories
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        icon: true,
        _count: {
          select: {
            posts: {
              where: {
                published: true,
              },
            },
          },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("获取分类列表失败:", error);
    return NextResponse.json({ error: "获取分类列表失败" }, { status: 500 });
  }
}

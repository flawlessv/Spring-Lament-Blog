import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * 自动初始化管理员账户 API
 * GET /api/admin/init
 *
 * 检查是否存在 admin 账户，如果不存在则自动创建
 * 默认账户：admin / 0919
 */
export async function GET() {
  try {
    // 检查是否已存在 admin 账户
    const existingAdmin = await prisma.user.findUnique({
      where: { username: "admin" },
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: "管理员账户已存在",
        initialized: true,
      });
    }

    // 创建默认管理员账户
    const defaultPassword = "0919";
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);

    const adminUser = await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@springlament.com",
        password: hashedPassword,
        role: "ADMIN",
        profile: {
          create: {
            displayName: "管理员",
            bio: "Spring Broken AI Blog Blog 系统管理员",
            website: "https://springlament.com",
          },
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    console.log(`✅ 自动创建管理员账户成功: ${adminUser.username}`);

    return NextResponse.json({
      success: true,
      message: "管理员账户创建成功",
      initialized: true,
      user: {
        username: adminUser.username,
        email: adminUser.email,
      },
    });
  } catch (error) {
    console.error("初始化管理员账户失败:", error);
    return NextResponse.json(
      {
        success: false,
        message: "初始化失败",
        error: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 }
    );
  }
}

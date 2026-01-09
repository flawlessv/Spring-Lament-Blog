/**
 * 图片上传 API
 *
 * POST /api/admin/images/upload
 * Body: FormData { postId, type, file }
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ensureImageDir,
  generateImageFilename,
  generateUniqueFilename,
  getImageUrl,
  getFileExtension,
  deleteImageFile,
} from "@/lib/images/utils";
import {
  isValidMimeType,
  validateFileSize,
  getExtensionFromMimeType,
} from "@/lib/images/validator";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    // 权限验证
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    // 解析表单数据
    const formData = await request.formData();
    const postId = formData.get("postId") as string;
    const type = formData.get("type") as "cover" | "content";
    const file = formData.get("file") as File;

    // 参数验证
    if (!postId || !type || !file) {
      return NextResponse.json(
        { error: "缺少必要参数：postId, type, file" },
        { status: 400 }
      );
    }

    if (type !== "cover" && type !== "content") {
      return NextResponse.json(
        { error: "type 必须是 cover 或 content" },
        { status: 400 }
      );
    }

    // 查询文章
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, slug: true },
    });

    if (!post) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    // 验证文件类型
    if (!isValidMimeType(file.type)) {
      return NextResponse.json(
        { error: "不支持的图片格式。仅支持：jpg, jpeg, png, webp, gif" },
        { status: 400 }
      );
    }

    // 验证文件大小
    const sizeValidation = validateFileSize(file.size, type);
    if (!sizeValidation.valid) {
      return NextResponse.json(
        { error: sizeValidation.error },
        { status: 400 }
      );
    }

    // 确保目录存在
    await ensureImageDir(post.slug);

    // 生成文件名（保留原文件名的有意义部分）
    const ext = getExtensionFromMimeType(file.type);
    const originalName = file.name.replace(/\.[^/.]+$/, ""); // 去除扩展名
    const baseFilename = generateImageFilename(type, ext, originalName);

    // 确保文件名唯一（如果已存在则自动添加序号）
    const filename = await generateUniqueFilename(post.slug, baseFilename);

    // 如果是封面图，删除已存在的封面图
    if (type === "cover") {
      const existingCover = await prisma.image.findFirst({
        where: { postId, type: "COVER" },
      });

      if (existingCover) {
        // 删除文件系统中的旧封面
        try {
          await deleteImageFile(existingCover.path);
        } catch (error) {
          console.error("删除旧封面图文件失败:", error);
        }

        // 删除数据库记录
        await prisma.image.delete({
          where: { id: existingCover.id },
        });
      }
    }

    // 写入文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(
      process.cwd(),
      "public",
      "images",
      "posts",
      post.slug,
      filename
    );
    await writeFile(filePath, buffer);

    // 保存到数据库
    const imagePath = getImageUrl(post.slug, filename);
    const image = await prisma.image.create({
      data: {
        filename,
        path: imagePath,
        size: file.size,
        mimeType: file.type,
        type: type === "cover" ? "COVER" : "CONTENT",
        postId,
      },
    });

    // 如果是封面图，更新文章的 coverImage 字段
    if (type === "cover") {
      await prisma.post.update({
        where: { id: postId },
        data: { coverImage: imagePath },
      });
    }

    return NextResponse.json({
      success: true,
      image,
      message: "图片上传成功",
    });
  } catch (error) {
    console.error("图片上传失败:", error);
    return NextResponse.json({ error: "图片上传失败" }, { status: 500 });
  }
}

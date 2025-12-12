import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  indexPost,
  indexAllPosts,
  deletePostIndex,
} from "@/lib/vector/indexer";

/**
 * 构建文章索引
 */
export async function POST(request: NextRequest) {
  try {
    // 权限验证 - 仅管理员可操作
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const body = await request.json();
    const { postId, force, all } = body;

    if (all) {
      // 批量索引所有文章
      const result = await indexAllPosts({ force: force || false });
      return NextResponse.json({
        success: result.failed === 0,
        ...result,
        message: `索引完成: ${result.indexed} 成功, ${result.skipped} 跳过, ${result.failed} 失败`,
      });
    } else if (postId) {
      // 索引单篇文章
      await indexPost(postId, { force: force || false });
      return NextResponse.json({
        success: true,
        indexed: 1,
        message: "索引构建完成",
      });
    } else {
      return NextResponse.json(
        { error: "请指定 postId 或设置 all: true" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("索引构建错误:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "索引构建失败" },
      { status: 500 }
    );
  }
}

/**
 * 删除文章索引
 */
export async function DELETE(request: NextRequest) {
  try {
    // 权限验证 - 仅管理员可操作
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "postId 不能为空" }, { status: 400 });
    }

    await deletePostIndex(postId);

    return NextResponse.json({
      success: true,
      message: "索引已删除",
    });
  } catch (error) {
    console.error("删除索引错误:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "删除索引失败" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { semanticSearch } from "@/lib/ai/rag";

export async function POST(request: NextRequest) {
  try {
    // 权限验证
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const { query, limit } = body;

    if (!query) {
      return NextResponse.json({ error: "搜索词不能为空" }, { status: 400 });
    }

    // 执行语义搜索
    const results = await semanticSearch(query, { limit: limit || 10 });

    return NextResponse.json({
      results,
      total: results.length,
    });
  } catch (error) {
    console.error("语义搜索错误:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "搜索失败" },
      { status: 500 }
    );
  }
}

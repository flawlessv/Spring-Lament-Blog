import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ragQuery } from "@/lib/ai/rag";

export async function POST(request: NextRequest) {
  try {
    // 权限验证
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const { question, options } = body;

    if (!question) {
      return NextResponse.json({ error: "问题不能为空" }, { status: 400 });
    }

    // 执行 RAG 查询
    const response = await ragQuery(question, {
      limit: options?.limit || 5,
      maxTokens: options?.maxTokens || 1000,
    });

    // 对话历史由前端 localStorage 管理，不再存数据库

    return NextResponse.json({
      answer: response.answer,
      sources: response.sources,
      tokensUsed: response.tokensUsed,
      mode: response.mode,
    });
  } catch (error) {
    console.error("RAG 查询错误:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "查询失败" },
      { status: 500 }
    );
  }
}

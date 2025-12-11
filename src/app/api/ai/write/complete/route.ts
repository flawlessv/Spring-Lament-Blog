import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAIClient } from "@/lib/ai/client";
import {
  COMPLETION_SYSTEM_MESSAGE,
  buildCompletionPrompt,
} from "@/lib/ai/prompts/completion";

/**
 * AI 内容补全 API
 *
 * 根据当前上下文和光标位置，生成内容补全建议
 */
export async function POST(request: NextRequest) {
  try {
    // 权限验证
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const { content, cursorPosition, context, style } = body;

    if (!content) {
      return NextResponse.json({ error: "内容不能为空" }, { status: 400 });
    }

    // 获取光标前后的上下文
    const beforeCursor = content.slice(0, cursorPosition || content.length);
    const afterCursor = content.slice(cursorPosition || content.length);

    // 提取最近的上下文（避免 prompt 过长）
    const recentContext = beforeCursor.slice(-500); // 最近 500 字符

    // 构建补全 Prompt
    const prompt = buildCompletionPrompt(recentContext, style || "专业");

    const aiClient = getAIClient();
    const response = await aiClient.chat(
      [
        {
          role: "system",
          content: COMPLETION_SYSTEM_MESSAGE,
        },
        { role: "user", content: prompt },
      ],
      {
        maxTokens: 100,
        temperature: 0.7,
      }
    );

    const suggestion = response.content.trim();

    // 如果建议为空或过长，返回空
    if (!suggestion || suggestion.length > 200) {
      return NextResponse.json({
        suggestions: [],
        tokensUsed: response.tokensUsed,
      });
    }

    return NextResponse.json({
      suggestions: [
        {
          text: suggestion,
          confidence: 0.8, // 可以基于更多因素计算
        },
      ],
      tokensUsed: response.tokensUsed,
    });
  } catch (error) {
    console.error("AI 补全错误:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "补全失败" },
      { status: 500 }
    );
  }
}

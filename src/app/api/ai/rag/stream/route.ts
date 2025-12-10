import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ragQueryStream } from "@/lib/ai/rag";

/**
 * 流式 RAG 查询 API
 * 使用 Server-Sent Events (SSE) 实现流式输出
 */
export async function POST(request: NextRequest) {
  try {
    // 权限验证
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "未授权" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const { question, options } = body;

    if (!question) {
      return new Response(JSON.stringify({ error: "问题不能为空" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 创建流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 发送初始消息（来源信息）
          const sendEvent = (type: string, data: any) => {
            const message = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
            controller.enqueue(encoder.encode(message));
          };

          // 执行流式 RAG 查询
          await ragQueryStream(
            question,
            {
              limit: options?.limit || 5,
              maxTokens: options?.maxTokens || 1000,
            },
            {
              onSources: (sources) => {
                sendEvent("sources", { sources });
              },
              onChunk: (chunk) => {
                sendEvent("chunk", { chunk });
              },
              onComplete: (result) => {
                sendEvent("complete", {
                  tokensUsed: result.tokensUsed,
                });
                controller.close();
              },
              onError: (error) => {
                sendEvent("error", {
                  error: error instanceof Error ? error.message : "查询失败",
                });
                controller.close();
              },
            }
          );
        } catch (error) {
          console.error("流式 RAG 查询错误:", error);
          const errorMessage = `event: error\ndata: ${JSON.stringify({
            error: error instanceof Error ? error.message : "查询失败",
          })}\n\n`;
          controller.enqueue(encoder.encode(errorMessage));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("流式 RAG 查询错误:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "查询失败",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

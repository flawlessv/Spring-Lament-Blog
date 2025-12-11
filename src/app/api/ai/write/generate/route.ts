import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAIClient } from "@/lib/ai/client";
import { prisma } from "@/lib/prisma";
import {
  buildTitlePrompt,
  buildExcerptPrompt,
  buildTagsPrompt,
  buildCategoryPrompt,
  buildOutlinePrompt,
  buildExpandPrompt,
  buildPolishPrompt,
} from "@/lib/ai/prompts/write";

export async function POST(request: NextRequest) {
  try {
    // 权限验证
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await request.json();
    const { type, content, options } = body;

    if (!type || !content) {
      return NextResponse.json(
        { error: "类型和内容不能为空" },
        { status: 400 }
      );
    }

    const aiClient = getAIClient();
    let prompt = "";

    switch (type) {
      case "title":
        prompt = buildTitlePrompt(content, {
          count: options?.count,
          style: options?.style,
        });
        break;

      case "excerpt":
        prompt = buildExcerptPrompt(content);
        break;

      case "tags": {
        // 从数据库获取现有标签
        const existingTags = await prisma.tag.findMany({
          select: { name: true },
          orderBy: { name: "asc" },
        });
        const tagNames = existingTags.map((t) => t.name);

        prompt = buildTagsPrompt(content, tagNames);
        break;
      }

      case "category": {
        // 从数据库获取现有分类
        const existingCategories = await prisma.category.findMany({
          select: { name: true },
          orderBy: { name: "asc" },
        });
        const categoryNames = existingCategories.map((c) => c.name);

        prompt = buildCategoryPrompt(content, categoryNames);
        break;
      }

      case "outline":
        prompt = buildOutlinePrompt(content);
        break;

      case "expand":
        prompt = buildExpandPrompt(content);
        break;

      case "polish": {
        prompt = buildPolishPrompt(content, options?.customPrompt);
        break;
      }

      default:
        return NextResponse.json({ error: "不支持的类型" }, { status: 400 });
    }

    const response = await aiClient.chat([{ role: "user", content: prompt }], {
      maxTokens: 1000,
      temperature: 0.7,
    });

    // 解析结果
    let results: string | string[] | { existing: string[]; new: string[] };

    if (type === "tags" || type === "category") {
      // 解析带有 existing/new 的 JSON 格式
      try {
        const jsonMatch = response.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          results = {
            existing: Array.isArray(parsed.existing) ? parsed.existing : [],
            new: Array.isArray(parsed.new) ? parsed.new : [],
          };
        } else {
          // 降级处理：如果解析失败，返回空结果
          results = { existing: [], new: [] };
        }
      } catch {
        results = { existing: [], new: [] };
      }
    } else if (type === "title") {
      try {
        const jsonMatch = response.content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          results = JSON.parse(jsonMatch[0]);
        } else {
          results = response.content
            .split("\n")
            .map((line) => line.replace(/^[-*•\d.]\s*/, "").trim())
            .filter(Boolean);
        }
      } catch {
        results = response.content
          .split("\n")
          .map((line) => line.replace(/^[-*•\d.]\s*/, "").trim())
          .filter(Boolean);
      }
    } else {
      results = response.content;
    }

    return NextResponse.json({
      results,
      tokensUsed: response.tokensUsed,
    });
  } catch (error) {
    console.error("AI 生成错误:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI 生成失败" },
      { status: 500 }
    );
  }
}

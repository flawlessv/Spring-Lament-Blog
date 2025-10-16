import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 创建 URL 友好的 slug
 */
export function createSlug(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      // 替换中文字符为拼音或移除（这里使用简单的移除方式）
      .replace(/[\u4e00-\u9fff]/g, "")
      // 替换空格和特殊字符为连字符
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "") ||
    // 如果为空，生成随机字符串
    `post-${Date.now()}`
  );
}

/**
 * 计算文本阅读时间（分钟）
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200; // 平均阅读速度
  const words = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return Math.max(1, readingTime);
}

/**
 * 生成文章摘要
 */
export function generateExcerpt(
  content: string,
  maxLength: number = 200
): string {
  // 移除 Markdown 语法
  const plainText = content
    .replace(/#{1,6}\s+/g, "") // 移除标题
    .replace(/\*\*(.*?)\*\*/g, "$1") // 移除加粗
    .replace(/\*(.*?)\*/g, "$1") // 移除斜体
    .replace(/`(.*?)`/g, "$1") // 移除行内代码
    .replace(/```[\s\S]*?```/g, "") // 移除代码块
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 移除链接，保留文字
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // 移除图片
    .replace(/^\s*[-*+]\s+/gm, "") // 移除列表标记
    .replace(/^\s*\d+\.\s+/gm, "") // 移除有序列表标记
    .replace(/\n{2,}/g, "\n") // 移除多余换行
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // 在单词边界截断
  const truncated = plainText.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.slice(0, lastSpaceIndex) + "...";
  }

  return truncated + "...";
}

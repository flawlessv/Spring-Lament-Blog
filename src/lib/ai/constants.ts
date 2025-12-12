/**
 * AI 生成类型常量
 */
export const AI_GENERATION_TYPES = {
  TITLE: "title",
  EXCERPT: "excerpt",
  TAGS: "tags",
  CATEGORY: "category",
  OUTLINE: "outline",
  EXPAND: "expand",
  POLISH: "polish",
} as const;

/**
 * AI 生成类型
 */
export type AIGenerationType =
  (typeof AI_GENERATION_TYPES)[keyof typeof AI_GENERATION_TYPES];
